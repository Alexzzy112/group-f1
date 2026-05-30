const User = require('../models/User');
const { generateToken, generateVerificationToken, generateResetToken } = require('../utils/helpers');
const { logAudit } = require('../utils/audit');

const MATRIC_PATTERN = /^FT\d{2}CMP\d{4}$/i;
const VALID_LEVELS = ['100Level', '200Level', '300Level', '400Level'];

exports.register = async (req, res) => {
  try {
    const { fullName, matricNumber, department, level, email, password } = req.body;

    const cleanMatric = String(matricNumber || '').trim().toUpperCase();
    if (!MATRIC_PATTERN.test(cleanMatric)) {
      return res.status(400).json({ message: 'Invalid matric number. Only Computer Science students (FT..CMP....) can register.' });
    }

    if (String(department || '').trim().toLowerCase() !== 'computer science') {
      return res.status(400).json({ message: 'Only Computer Science department is eligible.' });
    }

    const cleanLevel = String(level || '').trim();
    if (!VALID_LEVELS.includes(cleanLevel)) {
      return res.status(400).json({ message: 'Invalid level. Must be 100Level, 200Level, 300Level, or 400Level.' });
    }

    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { matricNumber: cleanMatric }],
    });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or matric number already exists.' });
    }

    const verificationToken = generateVerificationToken();

    const user = await User.create({
      fullName,
      matricNumber: cleanMatric,
      department: 'Computer Science',
      level: cleanLevel,
      email: email.toLowerCase(),
      password,
      verificationToken,
    });

    await logAudit({
      user: user._id,
      action: 'REGISTER',
      resource: 'User',
      resourceId: user._id,
      details: { email: user.email, matricNumber: user.matricNumber },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      message: 'Registration successful. Wait for admin approval.',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        matricNumber: user.matricNumber,
        role: user.role,
        isApproved: user.isApproved,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Duplicate entry detected.' });
    }
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (user.isLocked()) {
      return res.status(423).json({ message: 'Account locked. Try again later.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      user.loginAttempts += 1;
      if (user.loginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
      }
      await user.save();
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    user.loginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLogin = new Date();
    await user.save();

    await logAudit({
      user: user._id,
      action: 'LOGIN',
      resource: 'User',
      resourceId: user._id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    const token = generateToken(user._id, user.role);

    res.json({
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        matricNumber: user.matricNumber,
        department: user.department,
        level: user.level,
        role: user.role,
        isApproved: user.isApproved,
        hasVoted: user.hasVoted,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -verificationToken -resetPasswordToken -resetPasswordExpires');
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found with this email.' });
    }

    const resetToken = generateResetToken();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    res.json({ message: 'Password reset link sent to your email.', resetToken });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token.' });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

const User = require('../models/User');
const Election = require('../models/Election');
const Candidate = require('../models/Candidate');
const Vote = require('../models/Vote');
const AuditLog = require('../models/AuditLog');
const { logAudit } = require('../utils/audit');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalVoters = await User.countDocuments({ role: 'voter' });
    const approvedVoters = await User.countDocuments({ role: 'voter', isApproved: true });
    const pendingApprovals = await User.countDocuments({ role: 'voter', isApproved: false });
    const totalElections = await Election.countDocuments();
    const activeElections = await Election.countDocuments({ status: 'active' });
    const totalVotes = await Vote.countDocuments();
    const totalCandidates = await Candidate.countDocuments();

    res.json({
      totalVoters,
      approvedVoters,
      pendingApprovals,
      totalElections,
      activeElections,
      totalVotes,
      totalCandidates,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getVoters = async (req, res) => {
  try {
    const voters = await User.find({ role: 'voter' })
      .select('-password -verificationToken -resetPasswordToken -resetPasswordExpires')
      .sort({ createdAt: -1 });
    res.json({ voters });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.approveVoter = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { isApproved: true }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'Voter not found.' });
    }

    await logAudit({
      user: req.user._id,
      action: 'APPROVE_VOTER',
      resource: 'User',
      resourceId: id,
      details: { voterName: user.fullName, matricNumber: user.matricNumber },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({ message: `Voter ${user.fullName} approved successfully.` });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.rejectVoter = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'Voter not found.' });
    }

    await logAudit({
      user: req.user._id,
      action: 'REJECT_VOTER',
      resource: 'User',
      resourceId: id,
      details: { voterName: user.fullName },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({ message: 'Voter rejected and removed.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate('user', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(200);
    res.json({ logs });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.createAdmin = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    const admin = await User.create({
      fullName,
      email: email.toLowerCase(),
      password,
      role: 'admin',
      matricNumber: `ADM${Date.now()}`,
      department: 'Administration',
      level: 'N/A',
      isApproved: true,
    });

    res.status(201).json({ message: 'Admin created successfully.', admin: { id: admin._id, fullName: admin.fullName, email: admin.email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.unlockAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (!user.isLocked()) {
      return res.json({ message: 'Account is not locked.' });
    }

    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    await logAudit({
      user: req.user._id,
      action: 'UNLOCK_ACCOUNT',
      resource: 'User',
      resourceId: id,
      details: { unlockedUser: user.fullName, email: user.email },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({ message: `Account for ${user.fullName} unlocked successfully.` });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

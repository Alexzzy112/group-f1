const Candidate = require('../models/Candidate');
const Election = require('../models/Election');
const { logAudit } = require('../utils/audit');

exports.addCandidate = async (req, res) => {
  try {
    const { election, position, fullName, department, level, photoUrl, manifesto, slogan } = req.body;

    const electionDoc = await Election.findById(election);
    if (!electionDoc) {
      return res.status(404).json({ message: 'Election not found.' });
    }

    const candidate = await Candidate.create({
      election, position, fullName, department, level, photoUrl, manifesto, slogan,
    });

    await logAudit({
      user: req.user._id,
      action: 'ADD_CANDIDATE',
      resource: 'Candidate',
      resourceId: candidate._id,
      details: { fullName, position, election: electionDoc.title },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.status(201).json({ message: 'Candidate added successfully.', candidate });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Candidate already exists for this position.' });
    }
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.updateCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const candidate = await Candidate.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found.' });
    }

    res.json({ message: 'Candidate updated successfully.', candidate });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const candidate = await Candidate.findByIdAndDelete(id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found.' });
    }

    res.json({ message: 'Candidate deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getCandidatesByElection = async (req, res) => {
  try {
    const { electionId } = req.params;
    const candidates = await Candidate.find({ election: electionId }).sort({ position: 1, fullName: 1 });
    res.json({ candidates });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getCandidatesByPosition = async (req, res) => {
  try {
    const { electionId, position } = req.params;
    const candidates = await Candidate.find({ election: electionId, position });
    res.json({ candidates });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

const Vote = require('../models/Vote');
const Candidate = require('../models/Candidate');
const Election = require('../models/Election');
const User = require('../models/User');
const { logAudit } = require('../utils/audit');

exports.castVote = async (req, res) => {
  try {
    const { electionId, candidateId, position } = req.body;
    const voterId = req.user._id;

    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ message: 'Election not found.' });
    }

    if (election.status !== 'active') {
      return res.status(400).json({ message: 'Election is not active.' });
    }

    const now = new Date();
    if (now < new Date(election.startDate) || now > new Date(election.endDate)) {
      return res.status(400).json({ message: 'Election is not currently open.' });
    }

    const voter = await User.findById(voterId);
    if (!voter.isApproved) {
      return res.status(403).json({ message: 'Your account has not been approved yet.' });
    }

    const existingVote = await Vote.findOne({ election: electionId, voter: voterId, position });
    if (existingVote) {
      return res.status(409).json({ message: 'You have already voted for this position.' });
    }

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found.' });
    }

    const vote = await Vote.create({
      election: electionId,
      voter: voterId,
      candidate: candidateId,
      position,
    });

    await Candidate.findByIdAndUpdate(candidateId, { $inc: { voteCount: 1 } });

    const allPositions = election.positions;
    const votesCast = await Vote.countDocuments({ election: electionId, voter: voterId });

    if (votesCast >= allPositions.length) {
      await User.findByIdAndUpdate(voterId, { hasVoted: true, votedAt: new Date() });
    }

    await logAudit({
      user: voterId,
      action: 'CAST_VOTE',
      resource: 'Vote',
      resourceId: vote._id,
      details: { election: election.title, position, candidate: candidate.fullName },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.status(201).json({ message: `Vote cast successfully for ${candidate.fullName}.` });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Duplicate vote detected.' });
    }
    console.error('Vote error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getVoterHistory = async (req, res) => {
  try {
    const votes = await Vote.find({ voter: req.user._id })
      .populate('candidate', 'fullName position photoUrl')
      .populate('election', 'title')
      .sort({ createdAt: -1 });

    res.json({ votes });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getVoterStatus = async (req, res) => {
  try {
    const { electionId } = req.params;
    const votes = await Vote.find({ election: electionId, voter: req.user._id });
    const votedPositions = votes.map(v => v.position);
    res.json({ votedPositions, hasVoted: votes.length > 0 });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

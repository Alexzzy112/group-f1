const Election = require('../models/Election');
const Candidate = require('../models/Candidate');
const Vote = require('../models/Vote');
const { logAudit } = require('../utils/audit');

exports.createElection = async (req, res) => {
  try {
    const { title, description, startDate, endDate, positions } = req.body;

    const election = await Election.create({
      title,
      description,
      startDate,
      endDate,
      positions,
      createdBy: req.user._id,
    });

    await logAudit({
      user: req.user._id,
      action: 'CREATE_ELECTION',
      resource: 'Election',
      resourceId: election._id,
      details: { title },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.status(201).json({ message: 'Election created successfully.', election });
  } catch (error) {
    console.error('Create election error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.updateElection = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const election = await Election.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!election) {
      return res.status(404).json({ message: 'Election not found.' });
    }

    await logAudit({
      user: req.user._id,
      action: 'UPDATE_ELECTION',
      resource: 'Election',
      resourceId: election._id,
      details: updates,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({ message: 'Election updated successfully.', election });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.deleteElection = async (req, res) => {
  try {
    const { id } = req.params;
    const election = await Election.findByIdAndDelete(id);
    if (!election) {
      return res.status(404).json({ message: 'Election not found.' });
    }

    await Candidate.deleteMany({ election: id });
    await Vote.deleteMany({ election: id });

    await logAudit({
      user: req.user._id,
      action: 'DELETE_ELECTION',
      resource: 'Election',
      resourceId: id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({ message: 'Election and associated data deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getElections = async (req, res) => {
  try {
    const elections = await Election.find().sort({ createdAt: -1 });
    res.json({ elections });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getActiveElection = async (req, res) => {
  try {
    const now = new Date();
    let election = await Election.findOne({
      status: 'active',
      startDate: { $lte: now },
      endDate: { $gte: now },
    });

    if (!election) {
      election = await Election.findOne({ status: 'active' }).sort({ createdAt: -1 });
    }

    if (!election) {
      const upcoming = await Election.findOne({ status: 'pending' }).sort({ startDate: 1 });
      const ended = await Election.findOne({ status: 'ended' }).sort({ endDate: -1 });

      return res.json({
        election: null,
        upcoming: upcoming || null,
        lastElection: ended || null,
      });
    }

    res.json({ election });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.updateElectionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const now = new Date();

    const update = { status };

    if (status === 'active') {
      const election = await Election.findById(id);
      if (!election) {
        return res.status(404).json({ message: 'Election not found.' });
      }
      if (new Date(election.startDate) > now) {
        update.startDate = now;
      }
      if (new Date(election.endDate) < now) {
        const defaultEnd = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        update.endDate = defaultEnd;
      }
    }

    const election = await Election.findByIdAndUpdate(id, update, { new: true });
    if (!election) {
      return res.status(404).json({ message: 'Election not found.' });
    }

    await logAudit({
      user: req.user._id,
      action: `ELECTION_${status.toUpperCase()}`,
      resource: 'Election',
      resourceId: id,
      details: { title: election.title },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({ message: `Election ${status} successfully.`, election });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

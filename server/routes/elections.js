const express = require('express');
const router = express.Router();
const {
  createElection, updateElection, deleteElection,
  getElections, getActiveElection, updateElectionStatus,
} = require('../controllers/electionController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', getElections);
router.get('/active', getActiveElection);
router.post('/', auth, adminOnly, createElection);
router.put('/:id', auth, adminOnly, updateElection);
router.delete('/:id', auth, adminOnly, deleteElection);
router.patch('/:id/status', auth, adminOnly, updateElectionStatus);

module.exports = router;

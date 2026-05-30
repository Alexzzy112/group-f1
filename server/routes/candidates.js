const express = require('express');
const router = express.Router();
const {
  addCandidate, updateCandidate, deleteCandidate,
  getCandidatesByElection, getCandidatesByPosition,
} = require('../controllers/candidateController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/election/:electionId', getCandidatesByElection);
router.get('/election/:electionId/position/:position', getCandidatesByPosition);
router.post('/', auth, adminOnly, addCandidate);
router.put('/:id', auth, adminOnly, updateCandidate);
router.delete('/:id', auth, adminOnly, deleteCandidate);

module.exports = router;

const express = require('express');
const router = express.Router();
const { castVote, getVoterHistory, getVoterStatus } = require('../controllers/voteController');
const { auth } = require('../middleware/auth');
const { voteLimiter } = require('../middleware/rateLimiter');

router.post('/', auth, voteLimiter, castVote);
router.get('/history', auth, getVoterHistory);
router.get('/status/:electionId', auth, getVoterStatus);

module.exports = router;

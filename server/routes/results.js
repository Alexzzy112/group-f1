const express = require('express');
const router = express.Router();
const { getElectionResults, exportResultsPDF, exportResultsExcel } = require('../controllers/resultController');

router.get('/:electionId', getElectionResults);
router.get('/:electionId/pdf', exportResultsPDF);
router.get('/:electionId/excel', exportResultsExcel);

module.exports = router;

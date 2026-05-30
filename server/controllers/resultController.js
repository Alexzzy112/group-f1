const Election = require('../models/Election');
const Candidate = require('../models/Candidate');
const Vote = require('../models/Vote');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');

exports.getElectionResults = async (req, res) => {
  try {
    const { electionId } = req.params;
    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ message: 'Election not found.' });
    }

    const results = [];

    for (const position of election.positions) {
      const candidates = await Candidate.find({ election: electionId, position }).sort({ voteCount: -1 });

      const totalVotesForPosition = candidates.reduce((sum, c) => sum + c.voteCount, 0);

      const positionResults = {
        position,
        totalVotes: totalVotesForPosition,
        candidates: candidates.map((c, index) => ({
          id: c._id,
          fullName: c.fullName,
          department: c.department,
          photoUrl: c.photoUrl,
          manifesto: c.manifesto,
          slogan: c.slogan,
          voteCount: c.voteCount,
          percentage: totalVotesForPosition > 0 ? ((c.voteCount / totalVotesForPosition) * 100).toFixed(2) : '0.00',
          isWinner: index === 0 && election.status === 'ended',
        })),
      };

      results.push(positionResults);
    }

    const totalVotesCast = await Vote.countDocuments({ election: electionId });
    const totalVoters = election.status === 'ended' ? await Vote.distinct('voter', { election: electionId }).then(v => v.length) : null;

    res.json({
      election,
      results,
      totalVotesCast,
      totalVoters,
      isEnded: election.status === 'ended',
    });
  } catch (error) {
    console.error('Results error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.exportResultsPDF = async (req, res) => {
  try {
    const { electionId } = req.params;
    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ message: 'Election not found.' });
    }

    const doc = new PDFDocument({ margin: 30, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${election.title.replace(/\s+/g, '_')}_results.pdf"`);

    doc.pipe(res);

    doc.fontSize(22).font('Helvetica-Bold').text(election.title, { align: 'center' });
    doc.moveDown();
    doc.fontSize(11).font('Helvetica').text(`Election Period: ${new Date(election.startDate).toLocaleDateString()} - ${new Date(election.endDate).toLocaleDateString()}`, { align: 'center' });
    doc.text(`Status: ${election.status.toUpperCase()}`, { align: 'center' });
    doc.moveDown(1.5);

    for (const position of election.positions) {
      const candidates = await Candidate.find({ election: electionId, position }).sort({ voteCount: -1 });
      const totalVotes = candidates.reduce((sum, c) => sum + c.voteCount, 0);

      doc.fontSize(14).font('Helvetica-Bold').text(position.toUpperCase());
      doc.fontSize(10).font('Helvetica').text(`Total Votes: ${totalVotes}`);
      doc.moveDown(0.5);

      candidates.forEach((c, index) => {
        const pct = totalVotes > 0 ? ((c.voteCount / totalVotes) * 100).toFixed(1) : '0.0';
        const medal = index === 0 ? '🏆 ' : '';
        doc.fontSize(10).font('Helvetica').text(`${medal}${c.fullName} - ${c.voteCount} votes (${pct}%)`, { indent: 20 });
      });

      doc.moveDown(1);
    }

    doc.end();
  } catch (error) {
    console.error('PDF export error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.exportResultsExcel = async (req, res) => {
  try {
    const { electionId } = req.params;
    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ message: 'Election not found.' });
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Election Results');

    sheet.mergeCells('A1:D1');
    const titleCell = sheet.getCell('A1');
    titleCell.value = election.title;
    titleCell.font = { size: 16, bold: true };
    titleCell.alignment = { horizontal: 'center' };

    sheet.addRow([]);
    sheet.addRow(['Position', 'Candidate', 'Votes', 'Percentage']);

    sheet.columns = [
      { header: 'Position', key: 'position', width: 25 },
      { header: 'Candidate', key: 'candidate', width: 30 },
      { header: 'Votes', key: 'votes', width: 12 },
      { header: 'Percentage', key: 'percentage', width: 12 },
    ];

    const headerRow = sheet.getRow(3);
    headerRow.font = { bold: true };
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF6F42C1' } };
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };

    for (const position of election.positions) {
      const candidates = await Candidate.find({ election: electionId, position }).sort({ voteCount: -1 });
      const totalVotes = candidates.reduce((sum, c) => sum + c.voteCount, 0);

      if (candidates.length === 0) {
        sheet.addRow({ position, candidate: 'No candidates', votes: '-', percentage: '-' });
      } else {
        candidates.forEach(c => {
          const pct = totalVotes > 0 ? ((c.voteCount / totalVotes) * 100).toFixed(2) + '%' : '0%';
          sheet.addRow({ position, candidate: c.fullName, votes: c.voteCount, percentage: pct });
        });
      }

      sheet.addRow({});
    }

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${election.title.replace(/\s+/g, '_')}_results.xlsx"`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Excel export error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

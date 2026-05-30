const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  election: { type: mongoose.Schema.Types.ObjectId, ref: 'Election', required: true },
  voter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
  position: { type: String, required: true, trim: true },
}, { timestamps: true });

voteSchema.index({ election: 1, voter: 1, position: 1 }, { unique: true });
voteSchema.index({ election: 1, candidate: 1 });

module.exports = mongoose.model('Vote', voteSchema);

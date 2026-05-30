const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  election: { type: mongoose.Schema.Types.ObjectId, ref: 'Election', required: true },
  position: { type: String, required: true, trim: true },
  fullName: { type: String, required: true, trim: true },
  department: { type: String, required: true, trim: true },
  level: { type: String, trim: true },
  photoUrl: { type: String, default: '/images/default-avatar.png' },
  manifesto: { type: String, trim: true },
  slogan: { type: String, trim: true },
  voteCount: { type: Number, default: 0 },
}, { timestamps: true });

candidateSchema.index({ election: 1, position: 1 });

module.exports = mongoose.model('Candidate', candidateSchema);

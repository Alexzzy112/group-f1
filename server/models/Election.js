const mongoose = require('mongoose');

const electionSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ['pending', 'active', 'paused', 'ended'],
    default: 'pending',
  },
  positions: [{ type: String, trim: true }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

electionSchema.virtual('isActive').get(function () {
  const now = new Date();
  return this.status === 'active' && now >= this.startDate && now <= this.endDate;
});

electionSchema.virtual('timeRemaining').get(function () {
  const now = new Date();
  const end = new Date(this.endDate);
  return Math.max(0, end.getTime() - now.getTime());
});

electionSchema.set('toJSON', { virtuals: true });
electionSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Election', electionSchema);

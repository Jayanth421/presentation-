const mongoose = require('mongoose');

const classSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    year: { type: String, required: true },
    section: { type: String, required: true },
  },
  { timestamps: true }
);

classSchema.index({ name: 1, year: 1, section: 1 }, { unique: true });

module.exports = mongoose.model('Class', classSchema);

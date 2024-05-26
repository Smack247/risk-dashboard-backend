const mongoose = require('mongoose');

const riskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  source: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Risk', riskSchema);
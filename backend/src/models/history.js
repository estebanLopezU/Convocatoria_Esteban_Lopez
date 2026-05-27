const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now
  },
  inputData: {
    type: Array,
    required: true
  },
  outputData: {
    type: Array,
    required: true
  },
  summary: {
    totalInputRecords: Number,
    totalOutputRecords: Number,
    stationName: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('History', historySchema);
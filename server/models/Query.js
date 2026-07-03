const mongoose = require('mongoose');

const QuerySchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: 'New Chat'
  },
  type: {
    type: String,
    required: true,
    enum: ['code', 'debug', 'review']
  },
  input: {
    type: String,
    required: true
  },
  output: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Query', QuerySchema);

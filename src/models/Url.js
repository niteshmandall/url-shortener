const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  longUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
    unique: true,
  },
  alias: {
    type: String,
    unique: true,
    sparse: true,
  },
  topic: {
    type: String,
    enum: ['acquisition', 'activation', 'retention', null],
    default: null,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  clicks: [{
    timestamp: Date,
    ip: String,
    userAgent: String,
    os: String,
    device: String,
    location: {
      country: String,
      city: String,
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Url', urlSchema);
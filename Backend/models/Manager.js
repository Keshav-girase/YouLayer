const mongoose = require('mongoose');

const managerSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  invitedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Creator',
    },
  ],
  hasAccess: [
    {
      creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Creator',
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Automatically update timestamps
managerSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Manager = mongoose.model('Manager', managerSchema);
module.exports = Manager;

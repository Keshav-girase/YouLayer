const mongoose = require('mongoose');

// Use mongoose.Schema instead of just Schema
const teamSchema = new mongoose.Schema(
    {
      name: { type: String, required: true },
      creator: { type: mongoose.Schema.Types.ObjectId, ref: 'Creator', required: true },
      members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Manager' }], // List of team members/manager
    },
    { timestamps: true }
);

module.exports = mongoose.model('Team', teamSchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const invitationSchema = new Schema(
  {
    email: { type: String, required: true }, // Email of the invitee
    token: { type: String, required: true, unique: true }, // Unique invitation token
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'Creator', required: true }, // Creator who sent the invite
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true }, // Associated team
    status: { type: String, default: 'Pending', enum: ['Pending', 'Accepted', 'Declined'] }, // Status of the invitation
  },
  { timestamps: true }
);

module.exports = mongoose.model('Invitation', invitationSchema);

const crypto = require('crypto');

function generateInvitationToken() {
    return crypto.randomBytes(16).toString('hex'); // Generates a 32-character hexadecimal token
}

module.exports = { generateInvitationToken };
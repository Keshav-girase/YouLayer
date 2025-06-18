const crypto = require('crypto');
require('dotenv').config();
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Should be 32 bytes (e.g. 32 chars hex or base64)
// console.log(ENCRYPTION_KEY);

// Encrypt function generates a new random IV for each call
const encrypt = (text) => {
    const IV = crypto.randomBytes(16); // Generate a new IV for this encryption
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), IV);

    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    // Return iv and encrypted text separated by ':'
    return IV.toString('hex') + ':' + encrypted.toString('hex');
}

const decrypt = (encryptedText) => {
    const [ivHex, encrypted] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

module.exports = { encrypt, decrypt };

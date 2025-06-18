const mongoose = require('mongoose');
const { encrypt, decrypt } = require('../utils/encrypt');

const creatorSchema = new mongoose.Schema({
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
    oauthTokens: {
        access_token: String,
        refresh_token: String,
        scope: String,
        token_type: String,
        expiry_date: Number
    },
    teamMembers: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Manager', // Updated reference
        },
    ],
}, { timestamps: true } );


creatorSchema.pre('save', function(next) {
    if (this.oauthTokens) {
        if (this.isModified('oauthTokens.access_token') && this.oauthTokens.access_token) {
            // Only encrypt if not already encrypted (you can check presence of ':' in encrypted string)
            if (!this.oauthTokens.access_token.includes(':')) {
                this.oauthTokens.access_token = encrypt(this.oauthTokens.access_token);
            }
        }

        if (this.isModified('oauthTokens.refresh_token') && this.oauthTokens.refresh_token) {
            if (!this.oauthTokens.refresh_token.includes(':')) {
                this.oauthTokens.refresh_token = encrypt(this.oauthTokens.refresh_token);
            }
        }
    }
    next();
});


creatorSchema.methods.getDecryptedTokens = function () {
    return {
        access_token: this.oauthTokens?.access_token ? decrypt(this.oauthTokens.access_token) : null,
        refresh_token: this.oauthTokens?.refresh_token ? decrypt(this.oauthTokens.refresh_token) : null,
        scope: this.oauthTokens?.scope || null,
        token_type: this.oauthTokens?.token_type || null,
        expiry_date: this.oauthTokens?.expiry_date || null,
    };
};

const Creator = mongoose.model('Creator', creatorSchema);
module.exports = Creator;

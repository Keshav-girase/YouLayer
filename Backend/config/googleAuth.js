// config/googleAuth.js
const { google } = require('googleapis');
require('dotenv').config();

const createOAuth2Client = () => {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,     // Your client ID from Google Console
    process.env.GOOGLE_CLIENT_SECRET, // Your client secret from Google Console
    process.env.GOOGLE_REDIRECT_URIS  // Your redirect URI (should be registered in Google Console)
  );
  return oAuth2Client;
}

module.exports = { createOAuth2Client };

const { createOAuth2Client } = require('../config/googleAuth');
const Creator = require('../models/Creator')

// Generate the OAuth URL
exports.getAuthURL = (req, res) => {
  // console.log( "hh",req.user.id);
    try {
      const oAuth2Client = createOAuth2Client();

      const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline', // Get refresh token
        scope: ['https://www.googleapis.com/auth/youtube.upload'], // Specify YouTube upload scope
        prompt: 'consent', // Forces the user to consent again
        state: JSON.stringify({ userId: req.user.id })
      });
  
      res.status(200).json({ authUrl });
    } catch (error) {
      // console.error('Error generating auth URL:', error);
      res.status(500).json({ message: 'Failed to generate authorization URL' + `${ error.message}` });
    }
};
  
// Handle OAuth Callback
exports.handleOAuthCallback = async (req, res) => {
  const { code } = req.query;
  let state;
  try {
    state = JSON.parse(req.query.state);
  } catch {
    return res.status(400).json({ message: 'Invalid state parameter' });
  }

  const userId = state.userId;

  if (!code) {
    return res.status(400).json({ message: 'Authorization code is missing' });
  }

  try {
    const oAuth2Client = createOAuth2Client();
    const { tokens } = await oAuth2Client.getToken(code);
    // console.log(tokens);
    // oAuth2Client.setCredentials(tokens);

    const creator = await Creator.findById(userId);
    if (!creator) {
      return res.status(404).json({ message: "Creator not found" });
    }

    creator.oauthTokens = {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token || creator.oauthTokens?.refresh_token,
      scope: tokens.scope,
      token_type: tokens.token_type,
      expiry_date: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
    };

    await creator.save();
    // console.log("Encrypted access token:", creator.oauthTokens);
    // console.log("YouTube Authorization tokens:", tokens);
    res.redirect("http://localhost:5173/creator/dashboard?connected=youtube");
  } catch (error) {
    // console.error('Error during OAuth callback:', error);
    res.status(500).json({ message: 'Failed to retrieve tokens from YouTube' });
  }
};

  
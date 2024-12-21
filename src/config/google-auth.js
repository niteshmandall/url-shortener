const { OAuth2Client } = require('google-auth-library');

// Create a new OAuth2 client with the credentials
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Verify Google token
async function verifyGoogleToken(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    return ticket.getPayload();
    console.log(ticket.getPayload());
  } catch (error) {
    throw new Error('Invalid token');
  }
}

module.exports = { verifyGoogleToken };
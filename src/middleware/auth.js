const { verifyGoogleToken } = require('../config/google-auth');
const User = require('../models/User');

exports.authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Verify the token and get user info
    const payload = await verifyGoogleToken(token);
    
    // Find or create user
    let user = await User.findOne({ googleId: payload.sub });
    
    if (!user) {
      user = await User.create({
        email: payload.email,
        googleId: payload.sub,
        name: payload.name,
        picture: payload.picture,
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
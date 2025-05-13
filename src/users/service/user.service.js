const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const userModel = require('../model/user.model');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    // Check if user exists
    let user = await userModel.findByEmail(email);
    
    if (!user) {
      // Create new user if doesn't exist
      user = await userModel.create({
        email,
        name,
      });
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

module.exports = {
  googleLogin
}; 
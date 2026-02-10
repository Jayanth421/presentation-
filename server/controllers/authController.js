const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const PERSONAL_DOMAINS = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'live.com'];
const ALLOWED_DOMAIN = 'cmrcet.ac.in';

const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ message: 'Missing idToken' });

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = (payload.email || '').toLowerCase();

    if (!email) return res.status(400).json({ message: 'Email not found in token' });

    const domain = email.split('@')[1] || '';
    if (PERSONAL_DOMAINS.includes(domain)) {
      return res.status(403).json({ message: 'Personal emails are not allowed' });
    }
    if (!email.endsWith(`@${ALLOWED_DOMAIN}`)) {
      return res.status(403).json({ message: 'Only college domain emails are allowed' });
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: payload.name || 'User',
        email,
        googleId: payload.sub,
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('Google login error:', err.message);
    return res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = { googleLogin };

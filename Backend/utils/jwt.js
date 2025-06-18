const jwt = require('jsonwebtoken');

// Function to generate JWT token
const generateToken = (payload) => {
  return jwt.sign(
    payload, process.env.JWT_SECRET, { expiresIn: '24h' }
  );
};

// Function to verify JWT token
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
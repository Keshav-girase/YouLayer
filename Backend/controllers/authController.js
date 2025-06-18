const bcrypt = require('bcryptjs');
const Creator = require('../models/Creator');
const Manager = require('../models/Manager');
const { generateToken } = require('../utils/jwt');

// Creator signup
exports.signupCreator = async (req, res) => {
  const { email, name, password } = req.body;

  try {
    // Check if the creator already exists
    const existingCreator = await Creator.findOne({ email });
    if (existingCreator) {
      return res.status(400).json({ message: 'Creator already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new Creator
    const newCreator = new Creator({ email, name, password: hashedPassword });
    await newCreator.save();

    // Generate token
    const token = `Bearer ${generateToken({ id: newCreator._id, role: 'creator' })}`;
    res.status(201).json({ message: 'Creator account created', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Manager signup
exports.signupManager = async (req, res) => {
  const { email, name, password } = req.body;

  try {
    // Check if the manager already exists
    const existingManager = await Manager.findOne({ email });
    if (existingManager) {
      return res.status(400).json({ message: 'Manager already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new Manager
    const newManager = new Manager({ email, name, password: hashedPassword });
    await newManager.save();

    // Generate token
    const token = `Bearer ${generateToken({ id: newManager._id, role: 'manager' })}`;
    res.status(201).json({ message: 'Manager account created', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Creator login
exports.loginCreator = async (req, res) => {
  const { email, password } = req.body;

  try {
    const creator = await Creator.findOne({ email });
    if (!creator) {
      return res.status(404).json({ message: 'Creator not found' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, creator.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = `Bearer ${generateToken({ id: creator._id, role: 'creator' })}`;
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Manager login
exports.loginManager = async (req, res) => {
  const { email, password } = req.body;

  try {
    const manager = await Manager.findOne({ email });
    if (!manager) {
      return res.status(404).json({ message: 'Manager not found' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, manager.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = `Bearer ${generateToken({ id: manager._id, role: 'manager' })}`;
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

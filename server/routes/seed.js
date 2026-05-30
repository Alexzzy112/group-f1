const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/superadmin', async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'production' && req.headers['x-seed-key'] !== (process.env.SEED_KEY || 'nacos_seed_2026')) {
      return res.status(403).json({ message: 'Invalid seed key.' });
    }

    const existing = await User.findOne({ email: 'admin@nacos.edu.ng' });
    if (existing) {
      return res.json({ message: 'Superadmin already exists.', exists: true });
    }

    await User.create({
      fullName: 'NACOS Admin',
      email: 'admin@nacos.edu.ng',
      password: 'Admin123',
      role: 'superadmin',
      matricNumber: 'ADM0000001',
      department: 'Administration',
      level: 'N/A',
      isApproved: true,
    });

    res.status(201).json({ message: 'Superadmin created successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;

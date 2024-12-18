const express = require('express');
const pool = require('../config/db');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Create Repository
router.post('/', authenticateToken, async (req, res) => {
  const { name, description, private } = req.body;
  const userId = req.user.id;

  try {
    const query = 'INSERT INTO repositories (name, description, private, user_id) VALUES (?, ?, ?, ?)';
    await pool.query(query, [name, description, private, userId]);
    res.status(201).json({ message: 'Repository created successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get User Repositories
router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const query = 'SELECT * FROM repositories WHERE user_id = ?';
    const [rows] = await pool.query(query, [userId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

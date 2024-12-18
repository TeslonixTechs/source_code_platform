const express = require('express');
const pool = require('../config/db');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Add Commit
router.post('/:repo_id/commits', authenticateToken, async (req, res) => {
  const { repo_id } = req.params;
  const { message } = req.body;
  const userId = req.user.id;

  try {
    const query = 'INSERT INTO commits (repo_id, user_id, message) VALUES (?, ?, ?)';
    await pool.query(query, [repo_id, userId, message]);

    res.status(201).json({ message: 'Commit added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Commit History
router.get('/:repo_id/commits', async (req, res) => {
  const { repo_id } = req.params;

  try {
    const query = `
      SELECT commits.id, commits.message, commits.created_at, users.username 
      FROM commits 
      INNER JOIN users ON commits.user_id = users.id 
      WHERE commits.repo_id = ?
      ORDER BY commits.created_at DESC
    `;
    const [commits] = await pool.query(query, [repo_id]);

    res.json(commits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

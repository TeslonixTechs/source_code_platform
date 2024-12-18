const express = require('express');
const pool = require('../config/db');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Add Contributor
router.post('/:repo_id/contributors', authenticateToken, async (req, res) => {
  const { repo_id } = req.params;
  const { user_id } = req.body;
  const ownerId = req.user.id;

  try {
    // Verify repository ownership
    const [repo] = await pool.query('SELECT * FROM repositories WHERE id = ? AND user_id = ?', [repo_id, ownerId]);
    if (repo.length === 0) return res.status(403).json({ message: 'Unauthorized access' });

    const query = 'INSERT IGNORE INTO contributors (repo_id, user_id) VALUES (?, ?)';
    await pool.query(query, [repo_id, user_id]);

    res.status(201).json({ message: 'Contributor added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List Contributors
router.get('/:repo_id/contributors', authenticateToken, async (req, res) => {
  const { repo_id } = req.params;

  try {
    const query = `
      SELECT users.id, users.username 
      FROM contributors 
      INNER JOIN users ON contributors.user_id = users.id 
      WHERE contributors.repo_id = ?
    `;
    const [contributors] = await pool.query(query, [repo_id]);

    res.json(contributors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

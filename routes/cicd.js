const express = require('express');
const pool = require('../config/db');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Add CI/CD Configuration
router.post('/:repo_id/cicd', authenticateToken, async (req, res) => {
  const { repo_id } = req.params;
  const { build_command, deploy_command } = req.body;
  const userId = req.user.id;

  try {
    // Verify repository ownership
    const [repo] = await pool.query('SELECT * FROM repositories WHERE id = ? AND user_id = ?', [repo_id, userId]);
    if (repo.length === 0) return res.status(403).json({ message: 'Unauthorized access' });

    const query = 'INSERT INTO cicd (repo_id, build_command, deploy_command) VALUES (?, ?, ?)';
    await pool.query(query, [repo_id, build_command, deploy_command]);

    res.status(201).json({ message: 'CI/CD configuration added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

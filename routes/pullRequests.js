const express = require('express');
const pool = require('../config/db');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Create Pull Request
router.post('/:repo_id/pull-requests', authenticateToken, async (req, res) => {
  const { repo_id } = req.params;
  const { title, description, source_branch, target_branch } = req.body;
  const userId = req.user.id;

  try {
    // Check if repository exists
    const [repo] = await pool.query('SELECT * FROM repositories WHERE id = ?', [repo_id]);
    if (repo.length === 0) return res.status(404).json({ message: 'Repository not found' });

    const query = `
      INSERT INTO pull_requests (repo_id, user_id, title, description, source_branch, target_branch, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await pool.query(query, [repo_id, userId, title, description, source_branch, target_branch, 'open']);

    res.status(201).json({ message: 'Pull request created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List Pull Requests
router.get('/:repo_id/pull-requests', authenticateToken, async (req, res) => {
  const { repo_id } = req.params;

  try {
    const query = `
      SELECT id, title, description, source_branch, target_branch, status 
      FROM pull_requests 
      WHERE repo_id = ?
    `;
    const [pullRequests] = await pool.query(query, [repo_id]);

    res.json(pullRequests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Pull Request Status
router.patch('/:repo_id/pull-requests/:pr_id', authenticateToken, async (req, res) => {
  const { repo_id, pr_id } = req.params;
  const { status } = req.body;

  try {
    const query = 'UPDATE pull_requests SET status = ? WHERE id = ? AND repo_id = ?';
    await pool.query(query, [status, pr_id, repo_id]);

    res.json({ message: 'Pull request status updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

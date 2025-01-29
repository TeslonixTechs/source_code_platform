const express = require('express');
const authenticateToken = require('../middleware/auth');
const commitController = require('../controllers/commitController');
const router = express.Router();

// Add Commit
router.post('/:repo_id/commits', authenticateToken, commitController.addCommit);

// Get Commit History
router.get('/:repo_id/commits', commitController.getCommitHistory);

module.exports = router;
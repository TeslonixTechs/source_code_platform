const express = require('express');
const authenticateToken = require('../middleware/auth');
const pullRequestsController = require('../controllers/pullRequestController');
const router = express.Router();

// Create Pull Request
router.post('/:repo_id/pull-requests', authenticateToken, pullRequestsController.createPullRequests);

// List Pull Requests
router.get('/:repo_id/pull-requests', authenticateToken, pullRequestsController.listPullRequests);

// Update Pull Request Status
router.patch('/:repo_id/pull-requests/:pr_id', authenticateToken, pullRequestsController.updatePullRequests);

module.exports = router;
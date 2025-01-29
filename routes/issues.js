const express = require('express');
const authenticateToken = require('../middleware/auth');
const issuesController = require('../controllers/issuesController');
const router = express.Router();

// Create Issue
router.post('/:repo_id', authenticateToken, issuesController.createIssue);

// List Issues
router.get('/:repo_id', authenticateToken, issuesController.listIssues);

// Update Issue Status
router.patch('/:repo_id/:issue_id', authenticateToken, issuesController.updateIssueStatus);

// Create Issue
router.post('/:repo_id/issues', authenticateToken, issuesController.createIssue1);

// List Issues
router.get('/:repo_id/issues', issuesController.listIssues1);

// Add Label to Issue
router.post('/issues/:issue_id/labels', authenticateToken, issuesController.addIssueLabel);

module.exports = router;
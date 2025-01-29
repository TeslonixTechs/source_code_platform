const express = require('express');
const authenticateToken = require('../middleware/auth');
const activityLogsController = require('../controllers/activityController');
const router = express.Router();

// Fetch Activity Logs
router.get('/:repo_id/logs', authenticateToken, activityLogsController.fetchActivityLogs);

module.exports = router;
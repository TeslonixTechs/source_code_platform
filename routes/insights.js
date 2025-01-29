const express = require('express');
const authenticateToken = require('../middleware/auth');
const insightsController = require('../controllers/insightsController');
const router = express.Router();

// Get Repository Insights
router.get('/:repo_id/insights', insightsController.getRepositoryInsights);

module.exports = router;
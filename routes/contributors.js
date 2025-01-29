const express = require('express');
const authenticateToken = require('../middleware/auth');
const contributorController = require('../controllers/contributorController');
const router = express.Router();

// Add Contributor
router.post('/:repo_id/contributors', authenticateToken, contributorController.addContributor);

// List Contributors
router.get('/:repo_id/contributors', authenticateToken, contributorController.listContributor);

module.exports = router;
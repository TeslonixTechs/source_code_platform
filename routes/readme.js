const express = require('express');
const authenticateToken = require('../middleware/auth');
const readmeController = require('../controllers/readmeController');
const router = express.Router();

// Upload or Update README.md
router.post('/:repo_id/readme', authenticateToken, readmeController.createReadme);

// Get README.md
router.get('/:repo_id/readme', authenticateToken, readmeController.getReadme);

module.exports = router;
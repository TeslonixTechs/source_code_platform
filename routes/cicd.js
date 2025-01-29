const express = require('express');
const authenticateToken = require('../middleware/auth');
const cicdController = require('../controllers/cicdController');
const router = express.Router();

// Add CI/CD Configuration
router.post('/:repo_id/cicd', authenticateToken, cicdController.addCICD);

module.exports = router;
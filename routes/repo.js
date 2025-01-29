const express = require('express');
const authenticateToken = require('../middleware/auth');
const repoController = require('../controllers/repoController');
const router = express.Router();

// Create Repository
router.post('/', authenticateToken, repoController.createRepository);

// Get User Repositories
router.get('/', authenticateToken, repoController.getUserRepository);

module.exports = router;

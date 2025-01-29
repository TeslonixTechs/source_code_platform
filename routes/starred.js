const express = require('express');
const authenticateToken = require('../middleware/auth');
const starredController = require('../controllers/starredController');
const router = express.Router();

// Star Repository
router.post('/:repo_id/star', authenticateToken, starredController.starRepository);

// Unstar Repository
router.delete('/:repo_id/star', authenticateToken, starredController.deleteRepository);

// List Starred Repositories
router.get('/starred', authenticateToken, starredController.listStarRepository);

module.exports = router;
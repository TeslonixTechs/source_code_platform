const express = require('express');
const authenticateToken = require('../middleware/auth');
const forksController = require('../controllers/forksController');
const router = express.Router();

// Fork Repository
router.post('/:repo_id/fork', authenticateToken, forksController.forkRepository);

router.post('/:repo_id/fork1', authenticateToken, forksController.forkRepository1);

module.exports = router;
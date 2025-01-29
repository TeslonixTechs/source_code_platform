const express = require('express');
const authenticateToken = require('../middleware/auth');
const axios = require('axios');
const webhookController = require('../controllers/webhooksController');
const router = express.Router();

// Register Webhook
router.post('/:repo_id/webhooks', authenticateToken, webhookController.registerWebhook);

module.exports = router;
const express = require('express');
const authenticateToken = require('../middleware/auth');
const notificationController = require('../controllers/notificationsController');
const router = express.Router();

// Get Notifications
router.get('/', authenticateToken, notificationController.getNotifications);

// Mark Notification as Read
router.patch('/:id', authenticateToken, notificationController.markNotifications);

module.exports = router;
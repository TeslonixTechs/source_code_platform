const express = require('express');
const authenticateToken = require('../middleware/auth');
const authController = require('../controllers/authController');
require('dotenv').config();

const router = express.Router();

// Register
router.post('/register', authController.userRegistration);

// Verify Email
router.get('/verify', authController.verifyEmail);

// Login
router.post('/login', authController.userLogin);

// Enable 2FA
router.post('/2fa/setup', authenticateToken, authController.twoFactorSetup);

// Verify 2FA Code
router.post('/2fa/verify', authenticateToken, authController.verifyTwoFactor);

module.exports = router;

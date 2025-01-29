const express = require("express");
const authenticateToken = require("../middleware/auth");
const profileController = require('../controllers/profileController');
const { upload } = require("../config/multer");
const router = express.Router();

// Get Profile
router.get("/", authenticateToken, profileController.getUserProfile);

// Update Profile (Username and Profile Picture only)
router.patch("/", authenticateToken, upload.single("profile_picture"), profileController.updateUserProfile);

module.exports = router;
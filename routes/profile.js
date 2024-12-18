const express = require('express');
const multer = require('multer');
const pool = require('../config/db');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Configure Multer for Profile Picture Upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/profile_pictures');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Get Profile
router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const query = 'SELECT id, username, email, profile_picture FROM users WHERE id = ?';
    const [users] = await pool.query(query, [userId]);
    if (users.length === 0) return res.status(404).json({ message: 'User not found' });

    res.json(users[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Profile (Username and Profile Picture only)
router.patch('/', authenticateToken, upload.single('profile_picture'), async (req, res) => {
  const userId = req.user.id;
  const { username } = req.body;
  const profilePicture = req.file ? req.file.path : null;

  try {
    const updates = [];
    const values = [];

    if (username) {
      updates.push('username = ?');
      values.push(username);
    }

    if (profilePicture) {
      updates.push('profile_picture = ?');
      values.push(profilePicture);
    }

    if (updates.length === 0) return res.status(400).json({ message: 'No fields to update' });

    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
    values.push(userId);

    await pool.query(query, values);

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const express = require('express');
const pool = require('../config/db');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Get Notifications
router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const query = 'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC';
    const [notifications] = await pool.query(query, [userId]);

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark Notification as Read
router.patch('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const query = 'UPDATE notifications SET read = 1 WHERE id = ?';
    await pool.query(query, [id]);

    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

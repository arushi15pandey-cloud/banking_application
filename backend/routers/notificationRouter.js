const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const User = require('../models/User');

// GET /api/notifications — returns all notifications, newest first
router.get('/', async (req, res) => {
  try {
    const user = await User.findOne();
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found. Run /api/seed first.' });
    }

    const notifications = await Notification.find({ userId: user._id }).sort({ createdAt: -1 });

    const mapped = notifications.map((n) => ({
      id: n._id,
      title: n.title,
      text: n.text,
      time: n.time,
      unread: n.unread,
    }));

    res.json({ success: true, data: mapped });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/notifications/mark-read — mark all notifications as read
router.put('/mark-read', async (req, res) => {
  try {
    const user = await User.findOne();
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    await Notification.updateMany({ userId: user._id, unread: true }, { unread: false });

    res.json({ success: true, message: 'All notifications marked as read.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

// routes/notificationRoutes.js
const express = require('express');
const Notification = require('../Model/notificationmodel');
const User = require('../Model/usermodel');
const authMiddleware = require('../MiddileWare/authMiddleware'); 
const router = express.Router();


router.get('/notifications', authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ receiver: req.user._id })
      .populate('sender', 'username')
      .sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post('/notifications', async (req, res) => {
  try {
    const { type, senderId, receiverId } = req.body;
    
    const notification = new Notification({
      type,
      sender: senderId,
      receiver: receiverId,
    });

    await notification.save();
    res.status(201).json(notification);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

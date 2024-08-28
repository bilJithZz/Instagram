const express = require('express');
const router = express.Router(); 
const Chat = require('../Model/chatmodel'); 
const Message = require('../Model/messagemodel');

// Send a message
router.post('/sendMessage', async (req, res) => {
    try {
        const sendingId = req.user.id; // Assuming req.user is set by auth middleware
        const receivingId = req.body.receivingId;
        const { message } = req.body;

        // Find or create a chat
        let chat = await Chat.findOne({
            participants: { $all: [sendingId, receivingId] }
        });

        if (!chat) {
            chat = await Chat.create({
                participants: [sendingId, receivingId]
            });
        }

        // Create a new message
        const newMessage = await Message.create({
            senderId: sendingId,
            receiverId: receivingId,
            content: message
        });

        chat.messages.push(newMessage._id); 
        await chat.save();

        res.status(201).json({
            success: true,
            message: newMessage
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

module.exports = router;

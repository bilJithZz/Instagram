const express = require('express');
const router = express.Router();
const authMiddleware = require('../MiddileWare/authMiddleware');
const Chat = require('../Model/chatmodel');
const Message = require('../Model/messagemodel');
const { io } = require('../Socket/Socket');

// Send a message
router.post('/sendMessage', authMiddleware, async (req, res) => {
    try {
        const { senderId, receiverId, content } = req.body;

        if (!receiverId || !content) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        // Find or create chat
        let chat = await Chat.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!chat) {
            chat = await Chat.create({
                participants: [senderId, receiverId]
            });
        }

        // Create new message
        const newMessage = await Message.create({
            senderId,
            receiverId,
            content
        });

        // Add message to chat
        chat.messages.push(newMessage._id);
        await chat.save();

        // Respond to the client
        res.status(201).json({
            success: true,
            message: newMessage
        });
        if (io) {
            io.emit('newMessage', newMessage);
        }

    } catch (err) {
        console.error('Error sending message:', err);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        });
    }
});


router.get('/getMessages/:senderId/:receiverId', authMiddleware, async (req, res) => {
    try {
        const { senderId, receiverId } = req.params;

        if (!senderId || !receiverId) {
            return res.status(400).json({
                success: false,
                error: 'Sender ID and Receiver ID are required'
            });
        }
        const chat = await Chat.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate('messages');

        if (!chat) {
            return res.status(404).json({
                success: false,
                error: 'Chat not found'
            });
        }
        const messages = await Message.find({
            _id: { $in: chat.messages }
        });

        res.status(200).json({
            success: true,
            messages
        });

    } catch (err) {
        console.error('Error fetching messages:', err);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        });
    }
});

module.exports = router;

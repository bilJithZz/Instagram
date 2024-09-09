const express = require('express');
const router = express.Router();
const authMiddleware = require('../MiddileWare/authMiddleware');
const Chat = require('../Model/chatmodel');
const Message = require('../Model/messagemodel');
const { io } = require('../Socket/Socket'); // Ensure the path to your Socket.io instance is correct

// Send a message
router.post('/sendMessage', authMiddleware, async (req, res) => {
    try {
       
        const sendingId = req.body.senderId;
        const receivingId = req.body.receiverId
        const message=req.body.content;
        console.log({"M":req.body})
        

        if (!receivingId || !message) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

      
        let chat = await Chat.findOne({
            participants: { $all: [sendingId, receivingId] }
        });



        if (!chat) {
            chat = await Chat.create({
                participants: [sendingId, receivingId]
            });
        }

       
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

module.exports = router;

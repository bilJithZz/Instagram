
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const Chat = require('../Model/chatmodel');
const Message = require('../Model/messagemodel');

const app = express();
const server = http.createServer(app);

app.use(express.json());

const io = new socketIo.Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

const userSocketMap = {};

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
        console.log(`User ${userId} connected with socket ID ${socket.id}`);
    }

    socket.on('sendMessage', async ({ senderId, receiverId, message }) => {
        try {
            let chat = await Chat.findOne({
                participants: { $all: [senderId, receiverId] }
            });

            if (!chat) {
                chat = await Chat.create({
                    participants: [senderId, receiverId]
                });
            }

            const newMessage = await Message.create({
                senderId,
                receiverId,
                content: message
            });

            chat.messages.push(newMessage._id);
            await chat.save();

            io.to(`${senderId}-${receiverId}`).emit('newMessage', newMessage);
            io.to(`${receiverId}-${senderId}`).emit('newMessage', newMessage);

        } catch (error) {
            console.error(error);
        }
    });

    socket.on('disconnect', () => {
        if (userId) {
            delete userSocketMap[userId];
            console.log(`User ${userId} disconnected`);
        }
    });
});

module.exports = { app, server, io };

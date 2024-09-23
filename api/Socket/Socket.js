const http = require('http');
const socketIo = require('socket.io');
const express = require('express');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST'],
  },
});


module.exports = { io, server };
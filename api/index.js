const express = require("express");
const http = require("http"); // Import http module
const socketIo = require("socket.io"); // Import socket.io
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require('cors');
const postRouter = require("./Routes/postRoutes");
const authRouter = require("./Routes/authRoutes");
const messageRouter = require("./Routes/messageRoutes");
const notificationRoutes=require("./Routes/notificationRoutes")
const bodyParser = require('body-parser');

dotenv.config();

const app = express();
const server = http.createServer(app); 
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

global.io = io;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("Could not connect to MongoDB", err));

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(express.static('Images'));
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", authRouter);
app.use("/api/post", postRouter);
app.use("/api/message", messageRouter);
app.use('/api/notification', notificationRoutes);

// Socket.IO setup
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('sendMessage', async (message) => {
    try {
     
      io.emit('newMessage', message);
    } catch (error) {
      console.error('Error handling message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

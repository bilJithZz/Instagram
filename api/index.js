const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require('cors');
const messageRouter = require('./Routes/messageRoutes');
const { app, server, io } = require("./Socket/Socket"); 

dotenv.config();

const PORT = process.env.PORT || 5000;
const postRouter = require("./Routes/postRoutes");
const authRouter = require("./Routes/authRoutes");


mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("Could not connect to MongoDB", err));


app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.static('Images'));


app.use("/api/user", authRouter);
app.use("/api/post", postRouter);
app.use("/api/message", messageRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});


server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

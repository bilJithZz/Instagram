const express = require('express');
const authRouter = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Model/usermodel');
const authMiddleware = require('../MiddileWare/authMiddleware');

const saltRounds = 10;

// Registration
authRouter.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(401).json({ message: "Email already in use" });
        }

        const hashPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({ username, email, password: hashPassword });
        const savedUser = await newUser.save();

        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login
authRouter.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '23h' });

        res.status(200).json({
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                bio: user.bio,
                followers: user.followers,
                following: user.following,
                posts: user.posts
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Logout
authRouter.get('/logout', authMiddleware, async (req, res) => {
    try {
        res.cookie('token', '', { expires: new Date(0) });
        res.status(200).json({ message: "You have logged out" });
    } catch (err) { 
        res.status(500).json({ error: err.message });
    }
});

// Get Profile
authRouter.get("/getprofile/:id", authMiddleware, async (req, res) => { 
    try {
        const profileId = req.params.id;
        const getProfile = await User.findById(profileId);
        if (!getProfile) {
            return res.status(404).json({ message: "Profile not found" });
        }
        res.status(200).json(getProfile);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Set Profile
authRouter.post("/setprofile", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId; 
        const { bio, gender } = req.body;

        if (!bio && !gender) {
            return res.status(400).json({ message: "No fields to update" });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, { bio, gender }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get User Info
authRouter.get('/me', authMiddleware, (req, res) => {
    const userId = req.user.userId; 
    res.status(200).json({ id: userId });
});

// Follow User
authRouter.post("/follow/:id", authMiddleware, async (req, res) => {
    try {
        const myId = req.user.userId;
        const followingId = req.params.id;
        const me = await User.findById(myId);
        const followingUser = await User.findById(followingId);

        if (!me || !followingUser) {
            return res.status(404).json({ error: "User not found" });
        }

        if (!me.following.includes(followingId)) {
            me.following.push(followingId);
        }

        if (!followingUser.followers.includes(myId)) {
            followingUser.followers.push(myId);
        }

        await me.save();
        await followingUser.save();

        res.status(200).json({ message: "Followed successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Unfollow User
authRouter.post("/unfollow/:id", authMiddleware, async (req, res) => {
    try {
        const myId = req.user.userId;
        const unfollowingId = req.params.id;
        const me = await User.findById(myId);
        const unfollowingUser = await User.findById(unfollowingId);

        if (!me || !unfollowingUser) {
            return res.status(404).json({ error: "User not found" });
        }

        if (me.following.includes(unfollowingId)) {
            me.following = me.following.filter(id => id.toString() !== unfollowingId);
        }

        if (unfollowingUser.followers.includes(myId)) {
            unfollowingUser.followers = unfollowingUser.followers.filter(id => id.toString() !== myId);
        }

        await me.save();
        await unfollowingUser.save();

        res.status(200).json({ message: "Unfollowed successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get All Users
authRouter.get('/getAlluser', authMiddleware, async (req, res) => {
    try {
         
        const user = await User.find().select('-password'); 

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, user });
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = authRouter;

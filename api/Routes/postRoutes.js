const express = require("express");
const Post = require("../Model/postmodel");
const User = require("../Model/usermodel");
const Comment = require("../Model/commentmodel"); 
const authMiddleware = require('../MiddileWare/authMiddleware');
const router = express.Router();
const path = require("path");
const multer = require('multer');

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "..", "Images")); // Use path.join to handle path separators
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage }); 

// Create a post
router.post("/createpost", upload.single("image"), authMiddleware, async (req, res) => {
    try {
        const { content } = req.body;
        const authorId = req.user.userId;
        const picture = req.file;

        if (!picture) {
            return res.status(400).json({ message: "Please insert an image" });
        }

        const post = new Post({
            caption: content,
            author: authorId,
            picture: picture.path.replace(/\\/g, '/') // Convert Windows path separators to Unix
        });

        const savedPost = await post.save();
        const user = await User.findById(authorId);

        if (user) {
            user.posts.push(post._id);
            await user.save();
        } else {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(201).json({ message: "New post added", post: savedPost });
    } catch (err) {
        console.error("Error creating post:", err);
        res.status(500).json({ error: err.message });
    }
});

// Get all posts
router.get("/getallposts", async (req, res) => {
    try {
        const allPosts = await Post.find().sort({ createdAt: -1 }).populate({ path: 'author', select: "-password" });
        res.status(200).json({ allPosts, success: true });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get individual posts by author
router.get("/getpost/:id", authMiddleware, async (req, res) => {
    try {
        const authorId = req.params.id;
        console.log(authorId)
        const individualPosts = await Post.find({ author: authorId }).sort({ createdAt: -1 }).populate({ path: 'author', select: "-password" });
        res.status(200).json({ individualPosts, success: true });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Like a post
router.post("/likePost/:id", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const postId = req.params.id;
        console.log(userId)
        const likedPost = await Post.findById(postId);

        if (!likedPost) {
            return res.status(404).json({ error: "Post not found" });
        }

        if (!likedPost.likes.includes(userId)) {
            likedPost.likes.push(userId);
            await likedPost.save();
            res.status(200).json("Post liked");
        } else {
            res.status(400).json("You have already liked this post");
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Dislike a post
router.post("/dislikePost/:id", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const postId = params.id; 
        const dislikedPost = await Post.findById(postId);

        if (!dislikedPost) {
            return res.status(404).json({ error: "Post not found" });
        }

        if (dislikedPost.likes.includes(userId)) {
            dislikedPost.likes.pull(userId);
            await dislikedPost.save();
            res.status(200).json("Post disliked");
        } else {
            res.status(400).json("You have not liked this post yet");
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Add comment to a post
router.post("/addComment/:id", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { commentbody } = req.body;
        const postId = req.params.id;

        if (!commentbody) {
            return res.status(400).json({ message: 'Please write something' });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comment = await Comment.create({
            text: commentbody,
            author: userId,
            post: postId
        });

        await comment.populate({ path: "author", select: 'username profilepic' }).execPopulate();
        post.comments.push(comment._id);
        await post.save();
        res.status(201).json(comment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

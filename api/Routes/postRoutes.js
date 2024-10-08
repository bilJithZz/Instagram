const express = require("express");
const Post = require("../Model/postmodel");
const User = require("../Model/usermodel");
const Comment = require("../Model/commentmodel"); 
const authMiddleware = require('../MiddileWare/authMiddleware');
const router = express.Router();
const path = require("path");
const multer = require('multer');


const upload=multer({dest:"Images/"})

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
            picture: picture.path.replace(/\\/g, '/') 
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


//deletePost

router.delete("/delete/:id", authMiddleware, async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        if (post.author.toString() !== userId) {
            return res.status(403).json({ message: "You are not authorized to delete this post" });
        }
        user.posts.pull(postId);
        await user.save();
        await Post.deleteOne({ _id: postId });

        res.status(200).json({ message: "Post deleted successfully" });
        console.log("post deleted")
    } catch (err) {
        console.error("Error deleting post:", err);
        res.status(500).json({ error: err.message });
    }
});

// Get all posts
router.get("/getallposts", async (req, res) => {
    try {
        const allPosts = await Post.find().sort({ createdAt: -1 }).populate({ path: 'author', select: "-password" });
        res.status(200).json({ allPosts, success: true });
        console.log(allPosts)
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
        console.log({"null":userId})
        console.log({"null":postId})
        const likedPost = await Post.findById(postId);
        console.log(likedPost)

        if (!likedPost) {
            return res.status(404).json({ error: "Post not found" });
        }

        if (!likedPost.likes.includes(userId)) {
            likedPost.likes.push(userId);
            await likedPost.save();
            res.status(200).json("Post liked");
            console.log("postLiked")
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
        const postId = req.params.id; 
        const dislikedPost = await Post.findById(postId);

        if (!dislikedPost) {
            return res.status(404).json({ error: "Post not found" });
        }

        if (dislikedPost.likes.includes(userId)) {
            dislikedPost.likes.pull(userId);
            await dislikedPost.save();
            res.status(200).json("Post disliked");
            console.log("postis disLiked")
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

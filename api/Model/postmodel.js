const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
   caption: { type: String },
   picture: { type: String, required: true },  // Fixed 'require:ture' to 'required: true'
   author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Fixed 'require:ture' to 'required: true'
   likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],  
   comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comments', required: true }],  
}, { timestamps: true });

const Post = mongoose.model('Post', PostSchema);  

module.exports = Post;

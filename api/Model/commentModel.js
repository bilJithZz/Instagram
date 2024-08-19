const mongoose = require("mongoose");

const CommentsSchema = new mongoose.Schema({
   comment:{type:String,require:ture},
//    profilepicture:{type:mongoose.Schema.Types.ObjectId,ref:"User",require:ture },
   author:{ type:mongoose.Schema.Types.ObjectId,ref:'User',require:ture},
   post:{type:mongoose.Schema.Types.ObjectId,ref:"Post",require:ture },
}, { timestamps: true });

const Comment = mongoose.model('Post', CommentSchema);

module.exports = Comment;
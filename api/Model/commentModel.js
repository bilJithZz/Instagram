const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
   comment:{type:String,require:ture},
   author:{ type:mongoose.Schema.Types.ObjectId,ref:'User',require:ture},
   post:{type:mongoose.Schema.Types.ObjectId,ref:"Post",require:ture },
}, { timestamps: true });

const Comment = mongoose.model('Post', CommentSchema);

module.exports = Comment;
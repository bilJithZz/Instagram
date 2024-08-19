const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
   caption:{type:String},
   picture:{type:String,require:ture }
}, { timestamps: true });

const User = mongoose.model('Post', UserSchema);

module.exports = User;
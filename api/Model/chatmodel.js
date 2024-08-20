const mongoose=require("mongoose")

const chatSchema=new mongoose.Schema({
    participants:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    Message:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"message"
    }]
})

const chat=mongoose.model("chat",chatShema)
module.exports=chat;


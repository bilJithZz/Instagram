const express=require("express")
const router=express.Routerouter

router.get("/sendMessage",async(req,res)=>{
    try{const sendingId=req.id;
    const receveingId=req.params.id
    const {message}=req.body

    const chat=await Chat.findOne({
        participants:{$all:[sendingId,receveingId]}
    })

    if(!chat){
        chat=await Chat.create({
            participants:[sendingId,receveingId]
        })
    }
    const newMessage=await message.create({
        sendingId,
        receveingId,
        message
    });
    if(newMessage)
        chat.message.push(newMessage._id);
        await chat.save();
        await newMessage.save()
     }
    catch(err){
console.log(err);
    }
})
const express=require ("express")
const app=express()
const mongoose=require("mongoose")
const PORT=5000;
const post=require("./Routes/postRoutes")
const authRouter=require("./Routes/authRoutes")
const postRouter=require("./Routes/postRoutes")

mongoose.connect("mongodb://127.0.0.1:27017/Insta",)

app.use(express.json())

app.use("/api/user",authRouter)
app.use("/api/post",postRouter)

app.listen(PORT,()=>{
    console.log(`connnected to port${PORT}`)
})
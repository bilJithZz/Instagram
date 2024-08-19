const express=require ("express")
const app=express()
const mongoose=require("mongoose")
const PORT=5000;

mongoose.connect("")

app.use(express.json())

app.use("/api/user",)

app.listen(PORT,()=>{
    console.log(`connnected to port${PORT}`)
})
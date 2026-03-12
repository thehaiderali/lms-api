import express from "express"
import "dotenv/config"
import { connectDB } from "./utils/db.js"
import authRouter from "./routes/auth.routes.js"


const app=express()
app.use(express.json())
app.get("/",(_,res)=>res.send("LMS PLATFROM"))
app.use("/auth",authRouter)

const port=process.env.PORT || 3000
app.listen(port,async()=>{
    await connectDB()
    console.log("Server Started at PORT : ",port)
})
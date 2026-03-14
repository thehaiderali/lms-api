import express from "express"
import cors from "cors"
import "dotenv/config"
import { connectDB } from "./utils/db.js"
import authRouter from "./routes/auth.routes.js"
import courseRouter from "./routes/course.routes.js"
import lessonRouter from "./routes/lesson.routes.js"
import quizRouter from "./routes/quiz.routes.js"


const app=express()
app.use(express.json())
app.use(cors({
    origin:process.env.FRONTEND_URL
}))
app.get("/",(_,res)=>res.send("LMS PLATFROM"))
app.use("/api/auth",authRouter)
app.use("/api/courses",courseRouter)
app.use("/api/lessons",lessonRouter)
app.use("/api/quizzes",quizRouter)


const port=process.env.PORT || 3000
app.listen(port,async()=>{
    await connectDB()
    console.log("Server Started at PORT : ",port)
})
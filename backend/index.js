import express from "express"
import "dotenv/config"
import { connectDB } from "./utils/db.js"
import authRouter from "./routes/auth.routes.js"
import courseRouter from "./routes/course.routes.js"
import lessonRouter from "./routes/lesson.routes.js"
import quizRouter from "./routes/quiz.routes.js"


const app=express()
app.use(express.json())
app.get("/",(_,res)=>res.send("LMS PLATFROM"))
app.use("/auth",authRouter)
app.use("/courses",courseRouter)
app.use("/lessons",lessonRouter)
app.use("/quizzes",quizRouter)


const port=process.env.PORT || 3000
app.listen(port,async()=>{
    await connectDB()
    console.log("Server Started at PORT : ",port)
})
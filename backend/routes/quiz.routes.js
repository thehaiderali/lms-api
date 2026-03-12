import { Router } from "express";
import { deleteQuizById, getQuizById } from "../controllers/quiz.controller.js";
import { authenticateToken } from "../middleware/authenticate.js";
import { checkStudent } from "../middleware/checkStudent.js";
import { checkTeacherorAdmin } from "../middleware/checkTeacher.js";
import { checkUser } from "../middleware/checkUser.js";
const quizRouter=Router()
quizRouter.get("/:id",authenticateToken,checkUser,getQuizById);
quizRouter.put("/:id",authenticateToken,checkStudent,checkTeacherorAdmin)
quizRouter.delete("/:id",authenticateToken,checkTeacherorAdmin,deleteQuizById)


export default quizRouter
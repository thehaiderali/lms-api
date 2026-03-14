import { Router } from "express";
import { addQuiztoLesson, completeLesson, deleteLessonById, getLessonById, updateLessonById } from "../controllers/lesson.controller.js";
import { authenticateToken } from "../middleware/authenticate.js";
import { checkTeacherorAdmin } from "../middleware/checkTeacher.js";
import { checkStudent } from "../middleware/checkStudent.js";


const lessonRouter=Router()
lessonRouter.get("/:id",getLessonById)
lessonRouter.put("/:id",authenticateToken,checkTeacherorAdmin,updateLessonById)
lessonRouter.delete("/:id",authenticateToken,checkTeacherorAdmin,deleteLessonById)
lessonRouter.post("/:id/quiz",authenticateToken,checkTeacherorAdmin,addQuiztoLesson);
lessonRouter.post("/:id/complete",authenticateToken,checkStudent,completeLesson)
export default lessonRouter
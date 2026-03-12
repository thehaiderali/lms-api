import { Router } from "express";
import { 
    addLessonToCourse, 
    createCourse, 
    deleteCourse, 
    getCourseById, 
    getLessonsforCourse, 
    updateCourse,
    enrollCourse,
    getCourseAnalytics,
    getCourseProgress
} from "../controllers/course.controller.js";
import { getCourses } from "../controllers/course.controller.js";
import {authenticateToken} from "../middleware/authenticate.js"
import { checkStudent } from "../middleware/checkStudent.js";
import { checkTeacherorAdmin } from "../middleware/checkTeacher.js";


const courseRouter=Router();

courseRouter.post("/",authenticateToken,checkTeacherorAdmin,createCourse);
courseRouter.get("/",getCourses)
courseRouter.get("/:id",getCourseById);
courseRouter.post("/:id/enroll",authenticateToken,checkStudent,enrollCourse);
courseRouter.put("/:id",authenticateToken,checkTeacherorAdmin,updateCourse)
courseRouter.delete("/:id",authenticateToken,checkTeacherorAdmin,deleteCourse)
courseRouter.post("/:id/lessons",authenticateToken,checkTeacherorAdmin,addLessonToCourse)
courseRouter.get("/:id/lessons",getLessonsforCourse)
courseRouter.get("/:id/analytics",authenticateToken,checkTeacherorAdmin,getCourseAnalytics)
courseRouter.get("/:id/progress",authenticateToken,checkStudent,getCourseProgress)

export default courseRouter
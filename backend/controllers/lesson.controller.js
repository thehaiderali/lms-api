import Lesson from "../models/lesson.model.js";
import { createQuizSchema, updateLessonSchema } from "../utils/zod.js";
import Progress from "../models/progress.model.js"
import Quiz from "../models/quiz.model.js"
import Course from "../models/course.model.js";
import mongoose from "mongoose";



export async function getLessonById(req, res) {
    try {
        const lessonId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(lessonId)) {
            return res.status(400).json({
                success: false,
                error: "Invalid lesson ID format"
            });
        }
        const lesson = await Lesson.findById(lessonId)
        if (!lesson) {
            return res.status(404).json({
                success: false,
                error: "Lesson not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                lesson
            }
        });

    } catch (error) {
        console.error("Error in getLessonById:", error);

        return res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }
}

export async function updateLessonById(req, res) {
    try {
        const lessonId = req.params.id;
        const userId = req.user.userId;
        const isAdmin = req.user.role === "admin";

        if (!mongoose.Types.ObjectId.isValid(lessonId)) {
            return res.status(400).json({
                success: false,
                error: "Invalid lesson ID format"
            });
        }

        const lesson = await Lesson.findById(lessonId).populate('courseId');
        
        if (!lesson) {
            return res.status(404).json({
                success: false,
                error: "Lesson not found"
            });
        }

        const isTeacher = lesson.courseId.teacherId.toString() === userId;
        if (!isTeacher && !isAdmin) {
            return res.status(403).json({
                success: false,
                error: "Unauthorized to update this lesson"
            });
        }

        const { success, error: validationError, data } = updateLessonSchema.safeParse(req.body);
        
        if (!success) {
            return res.status(400).json({
                success: false,
                error: zodErrorParser(validationError)
            });
        }

        if (data.title && data.title !== lesson.title) {
            const existingTitle = await Lesson.findOne({
                title: data.title,
                courseId: lesson.courseId._id,
                _id: { $ne: lessonId }
            });
            
            if (existingTitle) {
                return res.status(400).json({
                    success: false,
                    message: 'A lesson with this title already exists in this course',
                    field: 'title'
                });
            }
        }

        if (data.order && data.order !== lesson.order) {
            const existingOrder = await Lesson.findOne({
                order: data.order,
                courseId: lesson.courseId._id,
                _id: { $ne: lessonId }
            });
            if (existingOrder) {
                return res.status(400).json({
                    success: false,
                    message: 'A lesson with this order number already exists in this course',
                    field: 'order'
                });
            }
        }

        const updatedLesson = await Lesson.findByIdAndUpdate(
            lessonId,
            { $set: data },
            { new: true, runValidators: true }
        ).select('-__v');

        return res.status(200).json({
            success: true,
            message: 'Lesson updated successfully',
            data: {
                updatedLesson
            }
        });

    } catch (error) {
        console.error("Error in updateLessonById:", error);
        return res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }
}

export async function deleteLessonById(req, res) {
    try {
        const lessonId = req.params.id;
        const userId = req.user.userId;
        const isAdmin = req.user.role === "admin";

        if (!mongoose.Types.ObjectId.isValid(lessonId)) {
            return res.status(400).json({
                success: false,
                error: "Invalid lesson ID format"
            });
        }

        const lesson = await Lesson.findById(lessonId).populate('courseId');
        
        if (!lesson) {
            return res.status(404).json({
                success: false,
                error: "Lesson not found"
            });
        }

        const isTeacher = lesson.courseId.teacherId.toString() === userId;
        if (!isTeacher && !isAdmin) {
            return res.status(403).json({
                success: false,
                error: "Unauthorized to delete this lesson"
            });
        }

        await Lesson.findByIdAndDelete(lessonId);

        await Course.findByIdAndUpdate(lesson.courseId._id, {
            $pull: { lessons: lessonId }
        });

        const order = lesson.order;
        await Lesson.updateMany(
            {
                courseId: lesson.courseId._id,
                order: { $gt: order }
            },
            { $inc: { order: -1 } }
        );

        return res.status(204).json({
            success:true,
            data:null
        });

    } catch (error) {
        console.error("Error in deleteLessonById:", error);
        
        return res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }
}

export async function addQuiztoLesson(req, res) {
    try {
        const lessonId = req.params.id;
        const isAdmin = req.user.role === "admin";
        const userId = req.user.userId;

        if (!mongoose.Types.ObjectId.isValid(lessonId)) {
            return res.status(400).json({
                success: false,
                error: "Invalid lesson ID format"
            });
        }

        const lesson = await Lesson.findById(lessonId).populate('courseId');
        
        if (!lesson) {
            return res.status(404).json({
                success: false,
                error: "Lesson not found"
            });
        }

        const isTeacher = lesson.courseId.teacherId.toString() === userId;
        if (!isTeacher && !isAdmin) {
            return res.status(403).json({
                success: false,
                error: "Unauthorized to add quiz to this lesson"
            });
        }
        const existingQuiz = await Quiz.findOne({ lessonId });
        if (existingQuiz) {
            return res.status(400).json({
                success: false,
                error: "A quiz already exists for this lesson"
            });
        }

        const { success, data, error: validationError } = createQuizSchema.safeParse(req.body);
        
        if (!success) {
            return res.status(400).json({
                success: false,
                error: zodErrorParser(validationError)
            });
        }

        const quiz = new Quiz({
            lessonId: lesson._id,
            title: data.title,
            questions: data.questions,
            passingScore: data.passingScore,
            timeLimit: data.timeLimit
        });

        await quiz.save();


        return res.status(201).json({
            success: true,
            data: {
                quiz
            }
        });

    } catch (error) {
        console.error("Error in Creating a Quiz for a Lesson:", error);

        return res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }
}




export async function completeLesson(req, res) {
    try {
        const lessonId = req.params.id;
        const studentId = req.user?.userId;
        const role = req.user?.role;

        if (!mongoose.Types.ObjectId.isValid(lessonId)) {
            return res.status(400).json({
                success: false,
                error: "Invalid lesson ID format"
            });
        }

        if (role !== "student") {
            return res.status(403).json({
                success: false,
                error: "Only students can complete lessons"
            });
        }

        const lesson = await Lesson.findById(lessonId).select("courseId title");

        if (!lesson) {
            return res.status(404).json({
                success: false,
                error: "Lesson not found"
            });
        }

        const { timeSpent } = req.body;

        if (timeSpent !== undefined && (typeof timeSpent !== "number" || timeSpent < 0)) {
            return res.status(400).json({
                success: false,
                error: "timeSpent must be a non-negative number"
            });
        }

        const progress = await Progress.findOneAndUpdate(
            { studentId, lessonId },
            {
                $set: {
                    completed: true,
                    completedAt: new Date(),
                    courseId: lesson.courseId
                },
                ...(timeSpent !== undefined && { $set: { timeSpent } })
            },
            {
                new: true,
                upsert: true,
                runValidators: true
            }
        );

        return res.status(201).json({
            success: true,
            data: progress
        });

    } catch (error) {
        console.error("Error in completeLesson:", error);

        return res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }
}
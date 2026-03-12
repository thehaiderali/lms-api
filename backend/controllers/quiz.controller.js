import Quiz from "../models/quiz.model.js";
import { updateQuizSchema, zodErrorParser } from "../utils/zod.js";
import mongoose from "mongoose";

export async function getQuizById(req, res) {
    try {
        const quizId = req.params.id;
        const userId = req.user?.userId;
        const isAdmin = req.user?.role === "admin";

        if (!mongoose.Types.ObjectId.isValid(quizId)) {
            return res.status(400).json({
                success: false,
                error: "Invalid quiz ID format"
            });
        }

        const quiz = await Quiz.findById(quizId)
            .populate({
                path: 'lessonId',
                select: 'title order courseId',
                populate: {
                    path: 'courseId',
                    select: 'title teacherId isPublished'
                }
            });

        if (!quiz) {
            return res.status(404).json({
                success: false,
                error: "Quiz not found"
            });
        }
        const isTeacher = quiz.lessonId.courseId.teacherId.toString() === userId;
        const hasAccess = isTeacher || isAdmin;
        const quizData = quiz.toObject();
        if (!hasAccess) {
            quizData.questions = quizData.questions.map(q => ({
                _id: q._id,
                question: q.question,
                options: q.options,
                explanation: q.explanation
            }));
        }

        return res.status(200).json({
            success: true,
            data: quizData,
            metadata: {
                totalQuestions: quiz.questions.length,
                totalPoints: quiz.questions.reduce((sum, q) => sum + 1, 10), 
                passingScore: quiz.passingScore,
                timeLimit: quiz.timeLimit,
                isTeacherView: hasAccess
            }
        });

    } catch (error) {
        console.error("Error in getQuizById:", error);

        return res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }
}
export async function updateQuizbyId(req, res) {
    try {
        const quizId = req.params.id;
        const userId = req.user?.userId;
        const isAdmin = req.user?.role === "admin";
        
        if (!mongoose.Types.ObjectId.isValid(quizId)) {
            return res.status(400).json({
                success: false,
                error: "Invalid quiz ID format"
            });
        }

        const quiz = await Quiz.findById(quizId)
            .populate({
                path: 'lessonId',
                select: 'title order courseId',
                populate: {
                    path: 'courseId',
                    select: 'title teacherId isPublished'
                }
            });

        if (!quiz) {
            return res.status(404).json({
                success: false,
                error: "Quiz not found"
            });
        }
        
        const isTeacher = quiz.lessonId.courseId.teacherId.toString() === userId;
        const hasAccess = isTeacher || isAdmin;

        if (!hasAccess) {
            return res.status(403).json({
                success: false,
                error: "Unauthorized. Only Teachers and Admins can access"
            });
        }

        if (quiz.lessonId.courseId.isPublished) {
            return res.status(403).json({
                success: false,
                error: "Cannot update quiz of a published course"
            });
        }
        const {success,data,error:ValidationError} = updateQuizSchema.safeParse(req.body);
        
        if (!success) {
            return res.status(400).json({
                success: false,
                error: zodErrorParser(ValidationError),
            });
        }

        const updateData = data
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                error: "No valid fields to update"
            });
        }
        const updatedQuiz = await Quiz.findByIdAndUpdate(
            quizId,
            { $set: updateData },
            { 
                new: true,  
                runValidators: true  
            }
        ).populate({
            path: 'lessonId',
            select: 'title order courseId'
        });
        console.log(`Quiz updated: ${quizId} by user: ${userId}`);

        return res.status(200).json({
            success: true,
            message: "Quiz updated successfully",
            data: updatedQuiz
        });

    } catch (error) {
        console.error("Error in updateQuizByID:", error);

        return res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }
}


export async function deleteQuizById(req, res) {
    try {
        const quizId = req.params.id;
        const userId = req.user?.userId;
        const isAdmin = req.user?.role === "admin";

        if (!mongoose.Types.ObjectId.isValid(quizId)) {
            return res.status(400).json({
                success: false,
                error: "Invalid quiz ID format"
            });
        }

        const quiz = await Quiz.findById(quizId)
            .populate({
                path: 'lessonId',
                select: 'title order courseId',
                populate: {
                    path: 'courseId',
                    select: 'title teacherId isPublished'
                }
            });

        if (!quiz) {
            return res.status(404).json({
                success: false,
                error: "Quiz not found"
            });
        }

        const isTeacher = quiz.lessonId.courseId.teacherId.toString() === userId;
        const hasAccess = isTeacher || isAdmin;

        if (!hasAccess) {
            return res.status(403).json({
                success: false,
                error: "Unauthorized. Only Teachers and Admins can delete"
            });
        }

        if (quiz.lessonId.courseId.isPublished) {
            return res.status(403).json({
                success: false,
                error: "Cannot delete quiz of a published course"
            });
        }

        await Quiz.findByIdAndDelete(quizId);

        console.log(`Quiz deleted: ${quizId} by user: ${userId}`);

        return res.status(200).json({
            success: true,
            message: "Quiz deleted successfully"
        });

    } catch (error) {
        console.error("Error in deleteQuizById:", error);

        return res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }
}
import mongoose, { Schema } from "mongoose";

const quizAttemptSchema = new Schema({
    studentId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Student ID is required"],
        validate: {
            validator: function(v) {
                return mongoose.Types.ObjectId.isValid(v);
            },
            message: "Invalid student ID format"
        }
    },
    quizId: {
        type: Schema.Types.ObjectId,
        ref: "Quiz",
        required: [true, "Quiz ID is required"],
        validate: {
            validator: function(v) {
                return mongoose.Types.ObjectId.isValid(v);
            },
            message: "Invalid quiz ID format"
        }
    },
    lessonId: {
        type: Schema.Types.ObjectId,
        ref: "Lesson",
        required: [true, "Lesson ID is required"],
        validate: {
            validator: function(v) {
                return mongoose.Types.ObjectId.isValid(v);
            },
            message: "Invalid lesson ID format"
        }
    },
    courseId: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: [true, "Course ID is required"],
        validate: {
            validator: function(v) {
                return mongoose.Types.ObjectId.isValid(v);
            },
            message: "Invalid course ID format"
        }
    },
    answers: [{
        questionId: {
            type: Schema.Types.ObjectId,
            required: true
        },
        selectedOption: {
            type: Number,
            required: true,
            min: 0,
            max: 3
        },
        isCorrect: {
            type: Boolean,
            required: true
        }
    }],
    score: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    totalQuestions: {
        type: Number,
        required: true,
        min: 1
    },
    correctAnswers: {
        type: Number,
        required: true,
        min: 0
    },
    passed: {
        type: Boolean,
        required: true
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    timeTaken: {
        type: Number,
        min: 0
    }
}, {
    timestamps: true
});

quizAttemptSchema.index({ studentId: 1, quizId: 1 });
quizAttemptSchema.index({ studentId: 1, courseId: 1, passed: 1 });
quizAttemptSchema.index({ quizId: 1, submittedAt: -1 });

const QuizAttempt = mongoose.model("QuizAttempt", quizAttemptSchema);

export default QuizAttempt;
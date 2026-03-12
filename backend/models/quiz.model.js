import mongoose, { Schema } from "mongoose";

const quizSchema = new Schema({
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
    title: {
        type: String,
        required: [true, "Quiz title is required"],
        trim: true,
        minlength: [3, "Title must be at least 3 characters long"],
        maxlength: [150, "Title cannot exceed 150 characters"]
    },
    questions: {
        type: [{
            _id: {
                type: Schema.Types.ObjectId,
                default: () => new mongoose.Types.ObjectId()
            },
            question: {
                type: String,
                required: [true, "Question text is required"],
                minlength: [5, "Question must be at least 5 characters long"]
            },
            options: {
                type: [String],
                required: [true, "Options are required"],
                validate: {
                    validator: function(v) {
                        return v.length === 4 && v.every(opt => opt.length >= 1 && opt.length <= 200);
                    },
                    message: "Must have exactly 4 options, each between 1-200 characters"
                }
            },
            correctAnswer: {
                type: Number,
                required: [true, "Correct answer index is required"],
                min: [0, "Correct answer index must be between 0-3"],
                max: [3, "Correct answer index must be between 0-3"]
            },
            explanation: {
                type: String,
                trim: true
            }
        }],
        required: [true, "At least one question is required"],
        validate: {
            validator: function(v) {
                return v && v.length > 0;
            },
            message: "Quiz must contain at least one question"
        }
    },
    passingScore: {
        type: Number,
        default: 60,
        min: [0, "Passing score cannot be less than 0"],
        max: [100, "Passing score cannot exceed 100"]
    },
    timeLimit: {
        type: Number,
        min: [1, "Time limit must be at least 1 minute"]
    }
}, {
    timestamps: true
});

quizSchema.index({ lessonId: 1 }, { unique: true });

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;
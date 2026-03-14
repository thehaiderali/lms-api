import mongoose, { Schema } from "mongoose";

const lessonProgressSchema = new Schema({
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
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Date
    },
    timeSpent: {
        type: Number,
        min: [0, "Time spent cannot be negative"]
    }
}, {
    timestamps: true
});

lessonProgressSchema.index({ studentId: 1, lessonId: 1 }, { unique: true });
lessonProgressSchema.index({ studentId: 1, courseId: 1, completed: 1 });
lessonProgressSchema.index({ lessonId: 1, completed: 1 });

const Progress = mongoose.model("Progress", lessonProgressSchema);

export default Progress;
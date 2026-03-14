import mongoose, { Schema } from "mongoose";

const enrollmentSchema = new Schema({
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
    enrolledAt: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

enrollmentSchema.index({ courseId: 1, studentId: 1 }, { unique: true });
enrollmentSchema.index({ studentId: 1, isActive: 1 });
enrollmentSchema.index({ courseId: 1, isActive: 1 });

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

export default Enrollment;
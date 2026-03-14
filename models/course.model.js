import mongoose, { Schema } from "mongoose";
import validator from "validator";

const courseSchema = new Schema({
    title: {
        type: String,
        required: [true, "Course title is required"],
        trim: true,
        minlength: [3, "Title must be at least 3 characters long"],
        maxlength: [200, "Title cannot exceed 200 characters"]
    },
    description: {
        type: String,
        required: [true, "Course description is required"],
        trim: true,
        minlength: [10, "Description must be at least 10 characters long"],
        maxlength: [2000, "Description cannot exceed 2000 characters"]
    },
    category: {
        type: String,
        enum: {
            values: ["Math", "Science", "English", "History", "Computer Science", "Other"],
            message: "{VALUE} is not a valid category"
        },
        default: "Other"
    },
    teacherId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Teacher ID is required"],
        validate: {
            validator: function(v) {
                return mongoose.Types.ObjectId.isValid(v);
            },
            message: "Invalid teacher ID format"
        }
    },
    enrolledStudents: [{
        type: Schema.Types.ObjectId,
        ref: "User",
        default: []
    }],
    imageUrl: {
        type: String,
        trim: true,
        validate: {
            validator: function(v) {
                if (!v) return true;
                return validator.isURL(v, {
                    protocols: ['http','https'],
                    require_protocol: true
                });
            },
            message: "Please provide a valid URL for the course image"
        }
    },
    isPublished: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

courseSchema.index({ teacherId: 1, isPublished: 1 });
courseSchema.index({ category: 1 });
courseSchema.index({ title: 'text', description: 'text' });



const Course = mongoose.model("Course", courseSchema);

export default Course;
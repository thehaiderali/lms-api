import mongoose, { Schema } from "mongoose";
import validator from "validator";

const lessonSchema = new Schema({
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
    title: {
        type: String,
        required: [true, "Lesson title is required"],
        trim: true,
        minlength: [3, "Title must be at least 3 characters long"],
        maxlength: [150, "Title cannot exceed 150 characters"]
    },
    content: {
        type: String,
        required: [true, "Lesson content is required"],
        trim: true,
        minlength: [10, "Content must be at least 10 characters long"]
    },
    videoUrl: {
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
            message: "Please provide a valid URL for the video"
        }
    },
    resourceUrl: {
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
            message: "Please provide a valid URL for the resource"
        }
    },
    order: {
        type: Number,
        required: [true, "Lesson order is required"],
        min: [1, "Order must be at least 1"]
    },
    duration: {
        type: Number,
        min: [0, "Duration cannot be negative"]
    }
}, {
    timestamps: true
});

lessonSchema.index({ courseId: 1, order: 1 }, { unique: true });
lessonSchema.index({ courseId: 1 });

const Lesson = mongoose.model("Lesson", lessonSchema);

export default Lesson;
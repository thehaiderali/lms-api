import mongoose, { Schema } from "mongoose";
import validator from "validator"; 

const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
        minlength: 2,
        maxlength: 100,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: validator.isEmail,
            message: "Please provide a valid email"
        }
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 6,
        maxlength: 1024, 
    },
    role: {
        type: String,
        enum: {
            values: ["admin", "student", "teacher"],
            message: "{VALUE} is not a valid role"
        },
        default: "student", 
        required: [true, "Role is required"]
    }
}, {
    timestamps: true
});

userSchema.index({ role: 1 });


const User = mongoose.model("User", userSchema);

export default User;
import { signUpSchema } from "../utils/zod.js";
import { loginSchema } from "../utils/zod.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import mongoose from "mongoose";



export async function signup(req,res){

    try {
        
      const {success,data,error}=signUpSchema.safeParse(req.body);
      if(!success){
        return res.status(400).json({
            success:false,
            error
        })
      }  
      const user=await User.findOne({email:data.email})
      if(user){
        return res.status(409).json({
            success:false,
            error:"User with given email already exists"
        })
      }

      const hashedPassword=await bcrypt.hash(data.password,10)
      const newUser=await User.create({
        email:data.email,
        role:data.role,
        name:data.name,
        password:hashedPassword
      })

      const userObject=newUser.toObject();
      delete userObject.password;

      return res.status(201).json({
        success:true,
        data:{
           user:userObject
        }
      })



    } catch (error) {

        console.log("Error in User Sign Up : ",error)
        return res.status(500).json({
            success:false,
            error:"Internal Server Error"
        })
        
    }

}



export async function login(req,res){

    try {
        
      const {success,data,error}=loginSchema.safeParse(req.body);
      if(!success){
        return res.status(400).json({
            success:false,
            error
        })
      }  
      const user=await User.findOne({email:data.email})
      if(!user){
        return res.status(401).json({
            success:false,
            error:"User does not exist with following email"
        })
      }

      const isMatch=await bcrypt.compare(data.password,user.password)
      if(!isMatch){
        return res.status(401).json({
            success:false,
            error:"User Password Incorrect"
        })
      }

      const token=jwt.sign({
        userId:user._id.toString(),
        role:user.role
      },process.env.JWT_SECRET,{
        expiresIn:"7d"
      })


      const userObject=user.toObject();
      delete userObject.password;

      return res.status(200).json({
        success:true,
        data:{
           token,
           user:userObject
        }
      })



    } catch (error) {

        console.log("Error in User Login in: ",error)
        return res.status(500).json({
            success:false,
            error:"Internal Server Error"
        })
        
    }

}


export async function getMe(req,res){

    try {
        
      if(!mongoose.Types.ObjectId.isValid(req.user.userId)){
          return res.status(400).json({
            success:false,
            error:"UserId not Valid"
          })
      }
      const user=await User.findById(req.user.userId);
      if(!user){
        return res.status(404).json({
            success:false,
            error:"User Id Does Not Exist "
        })
      }  

      const userObject=user.toObject();
      delete userObject.password;

      return res.status(200).json({
        success:true,
        data:{
           user:userObject
        }
      })
        
    } catch (error) {
     
       console.log("Error in Getting User /me: ",error)
        return res.status(500).json({
            success:false,
            error:"Internal Server Error"
        }) 
        
    }

}
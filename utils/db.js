import mongoose from "mongoose";
import "dotenv/config"
export async function connectDB(){

    try {
      await mongoose.connect(process.env.MONGO_URI)
      console.log("Database Connected Successfully ")  

    } catch (error) {
        console.log("Database Connection Failed :  ",error) 
    }

}
import User from "../models/user.model.js"

export async function checkUser(req,res,next){

    const id=req.user.userId;
    const user=await User.findById(id);
    if(!user){
        return res.status(404).json({
            success:false,
            error:"User Id Does not Exist"
        })
    }
    if(user){
        next()
    }
    else {
        return res.status(403).json({
            success:false,
            error:"Only Users can Access .  Not Authorized "
        })
    }
    

} 
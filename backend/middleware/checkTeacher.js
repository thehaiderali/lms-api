import User from "../models/user.model.js"

export async function checkTeacherorAdmin(req,res,next){

    const id=req.user.userId;
    const role=req.user.role

    const user=await User.findById(id);
    if(!user){
        return res.status(404).json({
            success:false,
            error:"User Id Does not Exist"
        })
    }
    if(user.role===role && role==="teacher" || user.role===role && role==="admin"){
        next()
    }
    else {
        return res.status(403).json({
            success:false,
            error:"Teacher / Admin Privileges Required ! Not Authorized "
        })
    }
    

} 
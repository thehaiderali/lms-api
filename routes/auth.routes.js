import { Router } from "express";
import { getMe, login, signup } from "../controllers/auth.controller.js";
import { authenticateToken } from "../middleware/authenticate.js";

const authRouter=Router()

authRouter.post("/signup",signup)
authRouter.post("/login",login)
authRouter.get("/me",authenticateToken,getMe)


export default authRouter
import jwt from"jsonwebtoken";
import { catchAsyncEroor } from "./catchAsyncError.js";
import EroorHandler from "../utils/errorHandler.js";
import User from "../modles/User.js";
import nodemailer from "nodemailer"
export const isAuthenticated=catchAsyncEroor(async(req,res,next)=>{
    const {token}=req.cookies;
    console.log("token is "+token)
    if(!token){
        return next(new EroorHandler("Not Logged in please login/signup"),401);
    }
    const extracted=jwt.verify(token,process.env.JWT_SECRET)
    req.user=await User.findById(extracted._id);
    next();
})
export const authorizeAdmin=catchAsyncEroor(async(req,res,next)=>{
    const {token}=req.cookies;
    console.log("token is "+token)
    console.log("req.user is "+req.user)
    if(!token){
        return next(new EroorHandler("Not Logged in please login/signup"),401);
    }
     console.log("role is " +req.user.role);
    if(req.user.role==="user"){
        return next(new EroorHandler("user cannot access this resource",401));
    }
    next();
    
})

export const authorizedSubscriber=catchAsyncEroor(async(req,res,next)=>{
    if(req.user.subscription.status !=="active" && req.user.role!=="admin"){
        return next(new EroorHandler("Only subscribers can access this resources"),403);
    }

    next();
})
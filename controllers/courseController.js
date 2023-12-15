import { catchAsyncEroor } from "../middleware/catchAsyncError.js"
import Course from "../modles/Course.js"
import getDataUri from "../utils/DtaUri.js";
import ErrorHandler from "../utils/errorHandler.js";
import cloudinary from"cloudinary"
import State from "../modles/Stats.js";
export const getAllCourse=catchAsyncEroor(
    async(req,res,next)=>{
        const keyword=req.query.keyword  || "";
        const category=req.query.category || "";
        ///console.log("keyword "+keyword)
        const courses=await Course.find({
            title:{
                $regex:keyword,
                $options:"i"
            },
            category:{
                $regex:category,
                $options:"i"
            }
        }).select("-lectures");
        res.status(200).json({
            success:true,
            courses
        })
    }
)

export const createCourse=catchAsyncEroor(
    async(req,res,next)=>{
        const {title,description,poster,category,createdBy}=req.body;
        if(!title || !description || !createdBy || !category){
            return next(new ErrorHandler("please add all fields ",400));
        }
        const file=req.file;
        console.log(file);
        const fileUri=getDataUri(file);
        //console.log(fileUri.content);
        const mycloud=await cloudinary.v2.uploader.upload(fileUri.content);
        await Course.create({title,description,category,createdBy,poster:{
            public_id:mycloud.public_id,
            url:mycloud.secure_url 
        }})
        //secure_url will give poster's url
        res.status(201).json({//created successfully
            success:true,
            message:"course created successfully..."
        })
    }
)

export const getAllCourselactures=catchAsyncEroor(
    async(req,res,next)=>{
        const course=await Course.findById(req.params.id);
        if(!course){
            return next(new ErrorHandler("course not found"),400);
        }
        course.views+=1;
        await course.save();
        res.status(200).json({
            success:true,
            lectures:course.lectures
        })
    }
)

export const addCourselactures=catchAsyncEroor(
    async(req,res,next)=>{
        const {id}=req.params.id
        const {title,description}=req.body
    
        const course=await Course.findById(req.params.id);
        if(!course){
            return next(new ErrorHandler("course not found"),400);
        }
        course.lectures.push({
            title,
            description,
            video:{
                public_id:"temp",
                url:"temp"
            }
        })
        course.numOfVideos=course.lectures.length;
        await course.save();
        res.status(200).json({
            success:true,
            "message":"lecture added successfully"
        })
    }
)
Course.watch().on("change",async()=>{
    const stats=await State.find().sort({createdAt:-1}).limit(1);
    const courses=await Course.find({});
    console.log("************");
    console.log(stats);
    console.log(courses);
    console.log("************");
    let totalViews=0;
    for(let i=0;i<courses.length;i++){
        totalViews+=courses[i].views;
    }
    stats[0].views=totalViews;
    stats[0].createdAt=new Date(Date.now())
    await stats[0].save();
    console.log("#####");
    console.log(stats[0]);
    console.log("#####")
})
import express from "express";
import { addCourselactures, getAllCourse, getAllCourselactures } from "../controllers/courseController.js"
import { createCourse } from "../controllers/courseController.js";
import singleUpload from "../middleware/Multer.js";
import { authorizedSubscriber, isAuthenticated } from "../middleware/Auth.js";
const router=express.Router();

router.route("/courses").get(getAllCourse);
router.route("/createcourses").post(singleUpload,createCourse);
router.route("/course/:id").get( isAuthenticated,authorizedSubscriber,getAllCourselactures).post(isAuthenticated,singleUpload,addCourselactures);
export default router;
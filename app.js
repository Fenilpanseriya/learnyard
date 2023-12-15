import express from "express"
import { config } from "dotenv"
import course from "./routes/courseRoutes.js"
import users from "./routes/userRoutes.js"
import other from "./routes/other.js"
import payment from "./routes/paymentRoutes.js"
import errorMiddleware from "./middleware/errorMiddleware.js"
import cookieParser from "cookie-parser"
const app=express();
config({
    path:"./config/config.env"
})
app.use(express.json())
app.use(express.urlencoded({
    extended:true,
}))
app.use(cookieParser());
app.use("/api/v1",course);
app.use("/api/v1",users)
app.use("/api/v1",payment);
app.use("/api/v1",other);
export default app;
app.use(errorMiddleware);
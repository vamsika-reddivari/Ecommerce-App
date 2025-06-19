import express from "express";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import 'dotenv/config';
import userRouter from "./router/userRoutes.js";
import productRouter from "./router/productRoutes.js";
import cors from "cors";
import carRouter from "./router/cartRoute.js";
import orderRouter from "./router/orderRoute.js";




const app=express()
const port=3000
connectDB()
connectCloudinary()

//middlewares
app.use(express.json())
app.use(cors()); 


//api end points
app.use("/api/user",userRouter)
app.use("/api/product",productRouter)
app.use("/api/cart",carRouter)
app.use('/api/order',orderRouter)

app.get("/",(req,res)=>{
    res.send("api working")
})

app.listen(port,()=>console.log('server started on:'+port))
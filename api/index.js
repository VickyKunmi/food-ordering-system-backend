import express from "express";
import cors from "cors";
import { connectDB } from "../config/db.js";
import foodRouter from "../routes/foodRoute.js";
import categoryRouter from "../routes/categoryRoute.js";
import userRouter from "../routes/userRoute.js";
import "dotenv/config";
import cartRouter from "../routes/cartRoute.js";
import orderRouter from "../routes/orderRoute.js";
import couponRouter from "../routes/couponRouter.js";
import adminRouter from "../routes/adminRoute.js";

// app config
const app = express();
const port = 3000;

// middleware
app.use(express.json());
app.use(cors());

// DB Connection
connectDB();

// api endpoint

app.use("/api/menu", foodRouter);
app.use("/api/category", categoryRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/coupon", couponRouter);

app.get("/", (req, res) => {
  res.send("API IS WORKING");
});

app.listen(port, () => {
  console.log(`Server started on loalhost: ${port}`);
});

// mongodb+srv://victoryoyekunleolamide:foodOrderingSys123@cluster0.lrota.mongodb.net/?

import express from "express";
import { getAllUsers, getTotalUsers, loginUser, registerUser } from "../controllers/userController.js";

const userRouter = express.Router();


userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get('/users', getAllUsers);
userRouter.get('/total', getTotalUsers);


export default userRouter;
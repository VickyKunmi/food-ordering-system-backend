import express from 'express';
import { addCoupon, deleteCoupon, getCouponByCode, getCouponById, getCoupons, updateCoupon } from '../controllers/couponController.js';

const couponRouter = express.Router();

couponRouter.post("/add", addCoupon);
couponRouter.get("/get", getCoupons);
couponRouter.post("/delete", deleteCoupon);
couponRouter.get("/get/:id", getCouponById);
couponRouter.put("/update/:id", updateCoupon);
couponRouter.get("/code/:code", getCouponByCode); 

export default couponRouter;
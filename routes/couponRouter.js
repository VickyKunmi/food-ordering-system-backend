import express from "express";
import {
  addCoupon,
  deleteCoupon,
  getAvailableCoupons,
  getClosedCoupons,
  getCouponByCode,
  getCouponById,
  getCoupons,
  getTotalCoupon,
  updateCoupon,
} from "../controllers/couponController.js";

const couponRouter = express.Router();

couponRouter.post("/add", addCoupon);
couponRouter.get("/get", getCoupons);
couponRouter.get("/total", getTotalCoupon);
couponRouter.get("/available", getAvailableCoupons);
couponRouter.get("/closed", getClosedCoupons);
couponRouter.post("/delete", deleteCoupon);
couponRouter.get("/get/:id", getCouponById);
couponRouter.put("/update/:id", updateCoupon);
couponRouter.get("/code/:code", getCouponByCode);

export default couponRouter;

import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountType: { type: String, required: true }, // 'percentage' or 'fixed'
  discountValue: { type: Number, required: true }, // Percentage or fixed value
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
});

const CouponModel =
  mongoose.models.coupon || mongoose.model("coupon", CouponSchema);
export default CouponModel;

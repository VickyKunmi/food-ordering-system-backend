import CouponModel from "../models/couponmodel.js";

// Add a new coupon
const addCoupon = async (req, res) => {
  const { code, discountType, discountValue, startDate, endDate } = req.body;

  // Validate required fields
  if (!code || !discountType || !discountValue || !startDate || !endDate) {
    return res.status(400).json({
      success: false,
      message: "All fields are required.",
    });
  }

  try {
    const coupon = new CouponModel({
      code,
      discountType,
      discountValue,
      startDate,
      endDate,
    });

    await coupon.save();
    res.status(201).json({ success: true, message: "Coupon Added" });
  } catch (error) {
    console.error(error);

    // Check for duplicate code error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Coupon code already exists.",
      });
    }

    res.status(500).json({
      success: false,
      message: "An error occurred while adding the coupon.",
    });
  }
};






const getCoupons = async (req, res) => {
  try {
    const coupons = await CouponModel.find({});
    res.json({ success: true, data: coupons });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Unable to get coupon list" });
  }
};

const deleteCoupon = async (req, res) => {
  try {
    const coupon = await CouponModel.findById(req.body.id);
    await CouponModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Coupon Deleted" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Unable to delete this coupon" });
  }
};

const getCouponById = async (req, res) => {
  try {
    const coupon = await CouponModel.findById(req.params.id);
    if (coupon) {
      res.json({ success: true, data: coupon });
    } else {
      res.json({ success: false, message: "Coupon not found" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Unable to get coupon" });
  }
};

const updateCoupon = async (req, res) => {
  try {
    const coupon = await CouponModel.findById(req.params.id);
    if (!coupon) {
      res.json({ success: false, message: "Coupon not found" });
    }
    if (req.body.code) coupon.code = req.body.code;
    if (req.body.discountType) coupon.discountType = req.body.discountType;
    if (req.body.discountValue) coupon.discountValue = req.body.discountValue;
    if (req.body.startDate) coupon.startDate = req.body.startDate;
    if (req.body.endDate) coupon.endDate = req.body.endDate;

    await coupon.save();
    res.json({success: true, message: "Coupon updated successfully"})
  } catch (error) {
    console.log(error);
    res.json({success: false, message: "Unable to update coupon"})
  }
};




// Fetch a coupon by its code
const getCouponByCode = async (req, res) => {
  try {
    const coupon = await CouponModel.findOne({ code: req.params.code });
    if (coupon) {
      res.json({ success: true, data: coupon });
    } else {
      res.json({ success: false, message: "Coupon not found" });
    }
  } catch (error) {
    console.error("Error fetching coupon:", error);
    res.status(500).json({ success: false, message: "An error occurred while fetching the coupon." });
  }
};




export { addCoupon, getCoupons, deleteCoupon, getCouponById, updateCoupon, getCouponByCode };



import mongoose from "mongoose";
import { type } from "os";

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: { type: Array, required: true },
  amount: { type: Number, required: true },
  address: { type: Object, require: true },
  status: { type: String, default: "Pending" },
  date: { type: Date, default: Date.now() },
  payment: { type: Boolean, default: false },
  orderMethod: { type: String, required: true },
  deliveryFee: { type: Number, required: false },
  discount: { type: Number, required: false },
  contact: {type: String, required: true},
  name: {type: String, required: true},
});

const OrderModel =
  mongoose.models.order || mongoose.model("order", OrderSchema);

  export default OrderModel;
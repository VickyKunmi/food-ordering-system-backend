import {
  initializeTransaction,
  verifyTransaction,
} from "../services/paystackService.js";
import OrderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

const placeOrder = async (req, res) => {
  try {
    // Generate order data but don't save it yet
    const orderData = {
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      name: req.body.name,
      deliveryFee: req.body.deliveryFee,
      discount: req.body.discount,
      orderMethod: req.body.orderMethod,
      contact: req.body.contact,
    };

    const newOrder = new OrderModel(orderData);
    await newOrder.save();
    // await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    const amountInKobo = Math.round(req.body.amount * 100);
    const metadata = {
      orderId: newOrder._id,
      orderData: newOrder, // Send the order data in the metadata for later use
    };

    const response = await initializeTransaction(
      req.body.email,
      amountInKobo,
      metadata
    );

    res.json({
      success: true,
      authorization_url: response.data.authorization_url,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.json({ success: false, message: "Error placing order" });
  }
};






const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.body; 


    if (!reference) {
      return res.status(400).json({ success: false, message: "Reference is required" });
    }

    // Verify the transaction with Paystack
    const response = await verifyTransaction({ reference });

    

    if (response && response.data && response.data.status === "success") {
      const orderId = response.data.metadata.orderId;

      if (!orderId) {
        return res.status(400).json({ success: false, message: "Order ID not found in metadata" });
      }

      // Update the payment status and order status in the database
      const orderUpdate = await OrderModel.findByIdAndUpdate(
        orderId,
        { payment: true, status: "Paid" },
        { new: true }
      );

      if (orderUpdate) {
        // Clear the user's cart
        await userModel.findByIdAndUpdate(orderUpdate.userId, { cartData: {} });

        res.json({ success: true, message: "Payment verified and order updated successfully" });
      } else {
        res.status(404).json({ success: false, message: "Order not found" });
      }
    } else {
      res.status(400).json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ success: false, message: "Error verifying payment" });
  }
};




const userOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// all users orders
const allOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

//  api for updating order status

const updateStatus = async (req, res) => {
  try {
    await OrderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const getTotalOrders = async (req, res) => {
  try {
    const count = await OrderModel.countDocuments({});
    res.json({ success: true, totalOrders: count });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error retrieving total orders" });
  }
};

export {
  placeOrder,
  verifyPayment,
  userOrders,
  allOrders,
  updateStatus,
  getTotalOrders,
};

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
      return res
        .status(400)
        .json({ success: false, message: "Reference is required" });
    }

    // Verify the transaction with Paystack
    const response = await verifyTransaction({ reference });

    if (response && response.data && response.data.status === "success") {
      const orderId = response.data.metadata.orderId;

      if (!orderId) {
        return res
          .status(400)
          .json({ success: false, message: "Order ID not found in metadata" });
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

        res.json({
          success: true,
          message: "Payment verified and order updated successfully",
        });
      } else {
        res.status(404).json({ success: false, message: "Order not found" });
      }
    } else {
      res
        .status(400)
        .json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res
      .status(500)
      .json({ success: false, message: "Error verifying payment" });
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

// const getTotalOrders = async (req, res) => {
//   try {
//     const count = await OrderModel.countDocuments({});
//     res.json({ success: true, totalOrders: count });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: "Error retrieving total orders" });
//   }
// };

const getTotalOrders = async (req, res) => {
  try {
    const totalOrders = await OrderModel.countDocuments({});
    const pickedUpOrders = await OrderModel.countDocuments({
      status: "Pickedup",
    });
    const deliveredOrders = await OrderModel.countDocuments({
      status: "Delivered",
    });

    res.json({
      success: true,
      totalOrders,
      pickedUpOrders,
      deliveredOrders,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error retrieving order counts" });
  }
};

const getPendingOrdersCount = async (req, res) => {
  try {
    const pendingOrdersCount = await OrderModel.countDocuments({
      status: { $nin: ["Pickedup", "Delivered"] }, 
    });

    res.json({
      success: true,
      pendingOrders: pendingOrdersCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching pending orders count",
    });
  }
};



// Controller function for orders chart data
const getOrdersChartData = async (req, res) => {
  try {
    const orders = await OrderModel.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }, // Sort by month
    ]);

    const labels = orders.map((order) => `Month ${order._id}`);
    const values = orders.map((order) => order.totalOrders);

    res.json({
      success: true,
      labels,
      values,
    });
  } catch (error) {
    res.json({ success: false, message: "Error fetching orders chart data" });
  }
};


// Controller function for revenue chart data
const getRevenueChartData = async (req, res) => {
  try {
    const revenue = await OrderModel.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalRevenue: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } }, // Sort by month
    ]);

    const labels = revenue.map((rev) => `Month ${rev._id}`);
    const values = revenue.map((rev) => rev.totalRevenue);

    res.json({
      success: true,
      labels,
      values,
    });
  } catch (error) {
    res.json({ success: false, message: "Error fetching revenue chart data" });
  }
};

// Controller function for sales distribution chart data
const getSalesChartData = async (req, res) => {
  try {
    const sales = await OrderModel.aggregate([
      {
        $unwind: "$items", // Deconstruct items array
      },
      {
        $group: {
          _id: "$items.name", // Group by item name
          totalSales: { $sum: "$items.quantity" },
        },
      },
    ]);

    const labels = sales.map((sale) => sale._id);
    const values = sales.map((sale) => sale.totalSales);

    res.json({
      success: true,
      labels,
      values,
    });
  } catch (error) {
    res.json({ success: false, message: "Error fetching sales chart data" });
  }
};



export {
  placeOrder,
  verifyPayment,
  userOrders,
  allOrders,
  updateStatus,
  getTotalOrders,
  getPendingOrdersCount,
  getOrdersChartData,
  getRevenueChartData,
  getSalesChartData,
};

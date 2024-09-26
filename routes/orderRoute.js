



import express from 'express';
import authMiddleware from "../middleware/auth.js";
import { allOrders, getTotalOrders, placeOrder, updateStatus, userOrders, verifyPayment } from '../controllers/orderController.js';
import OrderModel from '../models/orderModel.js';

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/verify", verifyPayment);
orderRouter.get("/allOrders", allOrders);
orderRouter.post("/status",  updateStatus);
orderRouter.post("/userOrders",  authMiddleware, userOrders);
orderRouter.get("/total", getTotalOrders);
// orderRouter.get("/:orderId", getOrderById);



// Add the webhook route
orderRouter.post("/webhook/paystack", (req, res) => {
    const event = req.body;
    
    if (event.event === "charge.success") {
        const orderId = event.data.metadata.orderId;

        OrderModel.findByIdAndUpdate(orderId, { payment: true }, { new: true })
            .then(() => {
                res.sendStatus(200); // Acknowledge webhook was received
            })
            .catch((error) => {
                console.error("Error updating order:", error);
                res.status(500).send("Error updating order");
            });
    } else {
        res.sendStatus(200); // Handle other events or ignore them
    }
});

export default orderRouter;

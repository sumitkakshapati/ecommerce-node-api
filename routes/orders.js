import express from "express";
import { authenticate } from "../middleware/authenticate.js";
import * as orderServices from '../services/order_service.js';
import { orderUpdateValidator, orderValidator,completeOrderValidator } from "../validators/order_validator.js";

const router = express();

//Read all Orders
router.get("/orders", authenticate, orderServices.getAllOrders);

//Read order by ID
router.get("/orders/:id", authenticate, orderServices.getSingleOrders);

//Create Order
router.post("/orders", authenticate, orderValidator, orderServices.createOrders);

//Complete Order Payment
router.post(
  "/orders/complete-payment",
  authenticate,
  completeOrderValidator,
  orderServices.completeOrderPayment
);

//Update Order
router.put("/orders/:id", authenticate, orderUpdateValidator, orderServices.updateOrders);

//Delete Order
router.delete("/orders/:id", authenticate, orderServices.deleteOrders);

export default router;






































































// router.get('/orders/get/count', async (req, res) => {
//     const orderCount = await Order.countDocuments((count) => count);
//     if (!orderCount) {
//         res.status(500), json({ success: false })
//     }
//     res.status(200).send({
//         orderCount: orderCount
//     });
// })

// router.get('/orders/get/totalsales', async (req, res) => {
//     const totalSales = await Order.aggregate([
//         { $group: {_id: null, totalsales:{ $sum :'$totalPrice'}}}
//     ])

//     if (!totalSales){
//         return res.status(400).send('the order sales cannot be generated')
//     }
//     res.send({ totalsales: totalSales.pop().totalsales})
// })

// router.get('/orders/get/usersorders/:userid', async (req, res) => {
//     const userOrderList = await Order.find({user: req.params.userid})
//         .populate({
//             path: 'orderItems', populate: {
//                 path: 'product', populate: 'category'
//             }
//         }).sort({ 'dateOrdered': -1 });

//     if (!userOrderList) {
//         res.status(500).json({ success: false })
//     }
//     res.send(userOrderList)
// })

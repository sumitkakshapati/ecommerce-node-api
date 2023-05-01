import Order from "../models/Order.js";
import Cart from '../models/Cart.js';
import { productFields } from "./product_service.js";

const orderFields = {
    _id: 1,
    orderItems: 1,
    full_name: 1,
    address: 1,
    city: 1,
    phone: 1,
    status: 1,
    totalPrice: 1
}

const orderItemFields = {
    _id: 1,
    quantity: 1,
    product: 1
}

export async function getAllOrders(req, res, next) {
    let { per_page, page, status } = req.query;
    per_page = per_page ? parseInt(per_page) : 10;
    page = page ? parseInt(page) - 1 : 0;
    status = status ?? undefined;

    const query = Order.find({ user: req.user._id })
        .limit(per_page)
        .skip(page * per_page)
        .select(orderFields)
        .populate({
            path: "orderItems",
            select: orderItemFields,
            model: "Cart",
            populate: {
                path: "product",
                model: "Product",
                select: productFields,
            }
        })

    if (["completed", "cancelled", "processing"].includes(status)) {
        query.find({ status: status });
    }

    const orderList = await query;

    if (!orderList) {
        res.status(500).json({ success: false, message: "Unable to fetch orders" });
    }
    res.send({ success: true, results: orderList });
}

export async function getSingleOrders(req, res, next) {
    const order = await Order.findById(req.params.id)
        .select(orderFields)
        .populate({
            path: "orderItems",
            select: orderItemFields,
            model: "Cart",
            populate: {
                path: "product",
                model: "Product",
                select: productFields,
            }
        });

    if (!order) {
        res.status(500).json({ success: false, message: "No order found" });
    }

    res.send({ success: true, results: order });
}

export async function createOrders(req, res, next) {
    console.log(req.body);
    const allCarts = await Cart.find({ user_id: req.user._id, is_ordered: false }).populate('product');

    if (allCarts.length == 0) {
        res.status(400).json({ 'success': false, "message": "Your cart is empty so order cannot be placed" });
        return;
    }

    const totalPrices = await Promise.all(
        allCarts.map(async (cartItem) => {
            const totalPrice = cartItem.product.price * cartItem.quantity;
            return totalPrice;
        })
    );

    const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

    let order = new Order({
        orderItems: allCarts.map((e) => e._id),
        address: req.body.address,
        city: req.body.city,
        phone: req.body.phone,
        totalPrice: totalPrice,
        user: req.user._id,
        full_name: req.body.full_name,
    });

    order = await order.save();
    if (!order) {
        res.status(404).send("Order cannot be created");
        return;
    } else {
        await Promise.all(
            allCarts.map(async (e) => {
                await Cart.findOneAndUpdate({ _id: e._id }, { $set: { is_ordered: true } })
            })
        );
    }
    const _orders = await Order.findOne({ _id: order._id }).select(orderFields)
        .populate({
            path: "orderItems",
            select: orderItemFields,
            model: "Cart",
            populate: {
                path: "product",
                model: "Product",
                select: productFields,
            }
        });
    res.send({ status: true, results: _orders });
}

export async function updateOrders(req, res, next) {
    console.log(req.body);
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    status: req.body.status
                },
            },
            { new: true }
        );
        res.status(200).json({ success: true, results: updatedOrder });
    } catch (err) {
        res.status(500).send({ success: true, results: err });
    }
}

export async function deleteOrders(req, res, next) {
    console.log(req.body);
    Order.findByIdAndRemove(req.params.id)
        .then(async (order) => {
            if (order) {
                await order.orderItems.map(async (orderItem) => {
                    await Cart.findByIdAndRemove(orderItem);
                });
                return res
                    .status(200)
                    .json({ success: true, message: "Order deleted successfully" });
            } else {
                return res
                    .status(404)
                    .json({ success: false, message: "Order cannot find" });
            }
        })
        .catch((err) => {
            return res.status(400).json({ success: false, error: err });
        });
}
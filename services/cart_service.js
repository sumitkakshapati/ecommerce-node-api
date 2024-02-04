import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { productFields } from './product_service.js';

export const cartFields = {
    "_id": 1,
    "product": 1,
    "quantity": 1,
};


export async function getAllCarts(req, res, next) {
    try {
        const allProducts = await Cart.find({
            user: req.user._id,
            is_ordered: false,
        }).select(cartFields).populate("product", productFields);

        const totalPrice = allProducts.reduce((pv, e) => pv + e.toJSON().product.price * e.toJSON().quantity, 0);
        res.status(200).json({ success: true, results: allProducts, totalPrice: totalPrice });
    } catch (e) {
        res.status(400).json({ success: false, "message": e })
    }
}

export async function totalCartPrice(req, res, next) {
    try {
        const allProducts = await Cart.find({
            user: req.user._id,
            is_ordered: false,
        }).select(cartFields).populate("product", productFields);

        const totalPrice = allProducts.reduce((pv, e) => pv + e.toJSON().product.price * e.toJSON().quantity, 0);
        res.status(200).json({ success: true, totalPrice: totalPrice });
    } catch (e) {
        res.status(400).json({ success: false, "message": e })
    }
}

export async function addToCarts(req, res, next) {
    try {
        console.log(req.body);
        const cartExist = await Cart.findOne({ product: req.body.product, is_ordered: false, user: req.user._id });
        if (cartExist) {
            res.status(400).json({ "success": false, "message": "Product already exists" });
        } else {
            const doesProductExist = await Product.findOne({ _id: req.body.product }).select({ _id: 1 });
            if (doesProductExist) {
                const newCart = Cart({ ...req.body, quantity: 1, user: req.user._id });
                const _savedItem = await newCart.save();
                const cartItem = await Cart.findOne({ _id: _savedItem._id }).select(cartFields).populate("product", productFields);

                res.status(200).json({ success: true, results: cartItem });
            } else {
                res.status(400).json({ success: false, "message": "Product doesnot exists!" });
            }
        }
    } catch (e) {
        res.status(400).json({ success: false, "message": e });
    }
}

export async function updateCartsProductCount(req, res, next) {
    try {
        console.log(req.body);
        const cartExist = await Cart.findOne({ _id: req.params.id, is_ordered: false, user: req.user._id, });
        if (cartExist) {
            const newCart = await Cart.findOneAndUpdate({ _id: req.params.id, user: req.user._id, }, { quantity: req.body.quantity }, { new: true }).select(cartFields).populate("product", productFields);
            res.status(200).json({ success: true, results: newCart });
        } else {
            res.status(400).json({ "success": false, "message": "Unable to find products" });
        }
    } catch (e) {
        res.status(400).json({ success: false, "message": e })
    }
}

export async function deleteCartProduct(req, res, next) {
    try {
        const products = await Cart.findByIdAndDelete(req.params.id)
        if (!products) {
            return res.status(404).json({
                "success": false,
                "message": "Cart item does not exist"
            });
        }
        res.status(200).json({
            "success": true,
            "message": "Cart item removed successfully"
        });

    } catch (e) {
        res.status(500).json({
            "success": false,
            "message": e
        });
    }
}

export async function countCarts(req, res, next) {
    try {
        const allProducts = await Cart.find({
            user: req.user._id,
            is_ordered: false,
        }).select(cartFields);
        res.status(200).json({ success: true, counts: allProducts.length });
    } catch (e) {
        res.status(400).json({ success: false, "message": e })
    }
}
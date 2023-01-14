import Cart from '../models/Cart.js';
import { productFields } from './product_service.js';


export async function getAllCarts(req, res, next) {
    try {
        const allProducts = await Cart.find({
            user_id: req.user._id,
            is_ordered: false,
        }).select({
            quantity: 1,
            product_id: 1,
        }).populate("product", productFields);
        res.status(200).json({ success: true, results: allProducts });
    } catch (e) {
        res.status(400).json({ success: false, "message": e })
    }
}

export async function addToCarts(req, res, next) {
    try {
        const cartExist = await Cart.findOne({ product: req.body.product, is_ordered: false });
        if (cartExist) {
            res.status(400).json({ "success": false, "message": "Product already exists" });
        } else {
            const newCart = Cart({ ...req.body, user: req.user._id });
            const _savedItem = await newCart.save();
            const cartItem = await Cart.findOne({ _id: _savedItem._id }).select({
                "_id": 1,
                "product": 1,
                "quantity": 1,
            }).populate("product", productFields);

            res.status(200).json({ success: true, results: cartItem });
        }
    } catch (e) {
        res.status(400).json({ success: false, "message": e })
    }
}

export async function updateCartsProductCount(req, res, next) {
    try {
        const cartExist = await Cart.findOne({ _id: req.params.id, is_ordered: false });
        if (cartExist) {
            const newCart = await Cart.findOneAndUpdate({ _id: req.params.id }, { quantity: req.body.quantity }, { new: true }).select({
                "_id": 1,
                "product": 1,
                "quantity": 1,
            }).populate("product", productFields);
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
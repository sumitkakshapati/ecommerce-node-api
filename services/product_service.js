import Cart from "../models/Cart.js";
import Product from "../models/Product.js";



export const productFields = {
    "_id": 1,
    "name": 1,
    "description": 1,
    "image": 1,
    "brand": 1,
    "price": 1,
    "catagories": 1,
};

export async function createProduct(req, res, next) {
    const newProduct = new Product(req.body);
    try {
        const saveProduct = await newProduct.save();
        res.status(200).send({ success: true, results: saveProduct });
    } catch (err) {
        res.status(400).json(err);
    }
}


export async function getSingleProduct(req, res, next) {
    try {
        const prodictId = req.params.id;
        Product.findById(prodictId).select(productFields).exec(async (err, doc) => {
            if (!doc) {
                res.status(404).json({ "success": false, "message": "Product not found" });
            } else {
                const _doesExist = await Cart.findOne({ product: doc._id, user: req.user._id, is_ordered: false });
                res.status(200).json({
                    success: true,
                    results: {
                        ...doc.toJSON(),
                        added_in_cart: _doesExist ? true : false,
                    },
                });
            }
        });
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
}

export async function getProductCategory(req, res, next) {
    try {
        const doc = await Product.find().select({ "catagories": 1 });
        if (!doc) {
            res.status(404).json({ "success": false, "message": "Product Category not found" });
        } else {
            const categories = [];
            for (var i = 0; i < doc.length; i++) {
                doc[i].catagories.forEach((value) => {
                    if (!categories.includes(value)) {
                        categories.push(value);
                    }
                });
            }
            res.status(200).json({
                success: true,
                results: categories,
            });
        }
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
}

export async function getAllProducts(req, res, next) {
    try {
        let { per_page, page, q, categories } = req.query;
        per_page = per_page ? parseInt(per_page) : 10;
        page = page ? parseInt(page) - 1 : 0;
        q = q ? q : undefined;
        categories = categories ? categories : undefined;
        let query = {};
        if (q) {
            query = {
                $or: [
                    { "name": { $regex: new RegExp(q, "i") } },
                    { "brand": { $regex: new RegExp(q, "i") } },
                    { 'catagories': { $regex: new RegExp(q, "i") } }
                ]
            }
        }

        if (categories) {
            query = {
                ...query,
                'catagories': { $regex: new RegExp(categories, "i") },
            }
        }

        Product.find(query).select(productFields).limit(per_page).skip(page * per_page).exec((err, doc) => {
            if (err) {
                res.status(500).send(err);
            }
            Product.countDocuments(query).exec((count_error, count) => {
                if (err) {
                    res.status(500).send(err);
                }
                return res.json({
                    success: true,
                    results: doc,
                    total: count,
                });
            });
        });
    } catch (err) {
        res.status(500).send(err);
    }
}

export async function updateSingleProduct(req, res, next) {
    if (req.body.userId == req.params.id) {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(
                req.params.id,
                {
                    $set: req.body,
                },
                { new: true }
            );
            res.status(500).json(updatedProduct);
        } catch (err) {
            res.status(500).send(err);
        }
    } else {
        res.status(401).send("You can only Update your Products");
    }
}

export async function deleteSingleProducts(req, res, next) {
    try {
        const products = await Product.findByIdAndDelete(req.params.id)
        if (!products) {
            return res.status(404).send();
        }
        res.status(200).send(user);

    } catch (e) {
        res.status(500).send();
    }
}
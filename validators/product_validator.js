import Joi from 'joi';
import product_status from '../contants/order_status.js';
import validate from '../utils/validate.js';

// Validation schema for product
const schemaForProduct = Joi.object({
    name: Joi.string().label('Product Name').required(),
    description: Joi.string().label("Description").required(),
    image: Joi.string().label("Image").required(),
    brand: Joi.string().label("Brand").required(),
    price: Joi.number().label("Brand").required(),
    catagories: Joi.array().items(Joi.string()).min(1).required()
});


// Validation schema for product
const schemaForProductUpdate = Joi.object({
    name: Joi.string().label('Product Name'),
    description: Joi.string().label("Description"),
    image: Joi.string().label("Image"),
    brand: Joi.string().label("Brand"),
    price: Joi.number().label("Brand"),
    catagories: Joi.array().items(Joi.string()).min(1)
});

/**
 * Validate create product request.
 *
 * @param   {Object}   req
 * @param   {Object}   res
 * @param   {Function} next
 * @returns {Promise}
 */
function productValidator(req, res, next) {
    return validate(req.body, schemaForProduct)
        .then(() => next())
        .catch((err) => {
            next(err);
        });
}

/**
 * Validate update product request.
 *
 * @param   {Object}   req
 * @param   {Object}   res
 * @param   {Function} next
 * @returns {Promise}
 */
function productUpdateValidator(req, res, next) {
    return validate(req.body, schemaForProductUpdate)
        .then(() => next())
        .catch((err) => {
            next(err);
        });
}

export { productValidator, productUpdateValidator };

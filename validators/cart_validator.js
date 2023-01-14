import Joi from 'joi';
import validate from '../utils/validate.js';

// Validation schema for cart
const schemaForCart = Joi.object({
    quantity: Joi.number().min(1).label('Quantity').required(),
    product: Joi.string().label("Product ID").required(),
});


// Validation schema for cart
const schemaForCartUpdate = Joi.object({
    quantity: Joi.number().min(1).label('Quantity').required(),
});

/**
 * Validate create cart request.
 *
 * @param   {Object}   req
 * @param   {Object}   res
 * @param   {Function} next
 * @returns {Promise}
 */
function cartValidator(req, res, next) {
    return validate(req.body, schemaForCart)
        .then(() => next())
        .catch((err) => {
            next(err);
        });
}

/**
 * Validate update cart request.
 *
 * @param   {Object}   req
 * @param   {Object}   res
 * @param   {Function} next
 * @returns {Promise}
 */
function cartUpdateValidator(req, res, next) {
    return validate(req.body, schemaForCartUpdate)
        .then(() => next())
        .catch((err) => {
            next(err);
        });
}

export { cartValidator, cartUpdateValidator };

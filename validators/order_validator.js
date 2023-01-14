import Joi from 'joi';
import order_status from '../contants/order_status.js';
import validate from '../utils/validate.js';

// Validation schema for order
const schemaForOrder = Joi.object({
    full_name: Joi.string().label('Full Name').required(),
    address: Joi.string().label("Address").required(),
    city: Joi.string().label("City").required(),
    phone: Joi.string().label("Phone").required(),
});


// Validation schema for order
const schemaForOrderUpdate = Joi.object({
    status: Joi.string().valid(order_status.cancelled, order_status.processing, order_status.completed).required(),
});

/**
 * Validate create order request.
 *
 * @param   {Object}   req
 * @param   {Object}   res
 * @param   {Function} next
 * @returns {Promise}
 */
function orderValidator(req, res, next) {
    return validate(req.body, schemaForOrder)
        .then(() => next())
        .catch((err) => {
            next(err);
        });
}

/**
 * Validate update order request.
 *
 * @param   {Object}   req
 * @param   {Object}   res
 * @param   {Function} next
 * @returns {Promise}
 */
function orderUpdateValidator(req, res, next) {
    return validate(req.body, schemaForOrderUpdate)
        .then(() => next())
        .catch((err) => {
            next(err);
        });
}

export { orderValidator, orderUpdateValidator };

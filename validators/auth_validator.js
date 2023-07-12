import Joi from 'joi';
import validate from '../utils/validate.js';
import {
    emailSchema,
    passwordSchema,
    phoneSchema,
} from './schemas.js';

// Validation schema
const schemaForRegister = Joi.object({
    name: Joi.string()
        .label('Full Name')
        .max(90)
        .required(),
    email: emailSchema.label('Email').required(),
    phone: phoneSchema.label('Email').required(),
    address: Joi.string().label("Address").required(),
    password: passwordSchema.label("Password").required(),
});

// Validation schema
const schemaForLogin = Joi.object({
    email: emailSchema.label('Email').required(),
    password: passwordSchema.label("Password").required(),
});

// Social Validation schema
const schemaForSocialLogin = Joi.object({
    token: Joi.string().label("Token").required(),
});

/**
 * Validate create/update user request.
 *
 * @param   {Object}   req
 * @param   {Object}   res
 * @param   {Function} next
 * @returns {Promise}
 */
function authRegisterValidator(req, res, next) {
    return validate(req.body, schemaForRegister)
        .then(() => next())
        .catch((err) => {
            next(err);
        });
}

/**
 * Validate create/update user request.
 *
 * @param   {Object}   req
 * @param   {Object}   res
 * @param   {Function} next
 * @returns {Promise}
 */
function authLoginValidator(req, res, next) {
    return validate(req.body, schemaForLogin)
        .then(() => next())
        .catch((err) => {
            next(err);
        });
}

/**
 * Validate create/update user request.
 *
 * @param   {Object}   req
 * @param   {Object}   res
 * @param   {Function} next
 * @returns {Promise}
 */
function authSocialLoginValidator(req, res, next) {
    return validate(req.body, schemaForSocialLogin)
        .then(() => next())
        .catch((err) => {
            next(err);
        });
}

export { authRegisterValidator, authLoginValidator,authSocialLoginValidator };

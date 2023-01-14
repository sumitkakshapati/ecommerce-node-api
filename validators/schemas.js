import Joi from "joi";

export const emailSchema = Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'care'] } })
    .lowercase();

export const phoneSchema = Joi.string()
    .length(10)
    .pattern(/^[0-9]+$/);

export const passwordSchema = Joi.string()
    .min(6);
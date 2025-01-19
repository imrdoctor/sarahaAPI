import joi from "joi";
import { Types } from "mongoose";
import { defaultGenders } from "../../src/DB/models/models.js";

export const customId = (value, helper) => {
    let data = Types.ObjectId.isValid(value);
    return data ? value : helper.message("id is not a valid")
}

export const genralRules = {
    ObjectId: joi.string().custom(customId).messages({
        "string.base": "id must be a string",
        "string.empty": "id is required",
        "string.custom": "id is not a valid",
        "any.required": "id is required",
    }),
    freezeReson: joi.string().min(5).max(100).messages({
        'string.base': 'reson must be a string',
        'string.empty': 'reson is required',
        'string.min': 'reson must be at least 10 characters',
        'string.max': 'reson must not exceed 100 characters',
        'any.required': 'reson is required',
    }),
    messageContent: joi.string().min(2).max(300).messages({
        'string.base': 'message must be a string',
        'string.empty': 'message is required',
        'string.min': 'message must be at least 2 characters',
        'string.max': 'message must not exceed 300 characters',
        'any.required': 'message is required',
    }),
    name: joi.string().min(3).max(15).messages({
        'string.base': 'Name must be a string',
        'string.empty': 'Name is required',
        'string.min': 'Name must be at least 3 characters',
        'string.max': 'Name must not exceed 15 characters',
        'any.required': 'Name is required',
    }),
    email: joi.string().email({ tlds: { allow: true } }).messages({
        'string.base': 'Email must be a string',
        'string.email': 'Please provide a valid email address',
        'string.empty': 'Email is required',
        'any.required': 'Email is required',
    }),
    password: joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/).messages({
        'string.base': 'Password must be a string',
        'string.empty': 'Password is required',
        'string.pattern.base':
            'Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character',
        'any.required': 'Password is required',
    }),
    Repassword: joi.string().valid(joi.ref('password')).messages({
        'any.only': 'Repassword must match Password',
        'string.empty': 'Repassword is required',
        'any.required': 'Repassword is required',
    }),
    phone: joi.string().regex(/^01[0125][0-9]{8}$/).messages({
        'string.base': 'Phone number must be a string',
        'string.empty': 'Phone number is required',
        'string.pattern.base': 'Phone number must be a Egyption number',
        'any.required': 'Phone number is required',
    }),
    gender: joi.string().valid (defaultGenders.female,defaultGenders.male).messages({
        'string.base': 'Gender must be a string',
        'string.empty': 'Gender is required',
        'any.only': 'Gender must be either "male" or "female"',
        'any.required': 'Gender is required',
    }),
    headers: joi.object({
        authorization: joi.string().required()
    })
}
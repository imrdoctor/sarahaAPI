import joi from "joi";
import { genralRules } from "../../../utils/genralRules/genralRules.js";
export const signUpSchema = {
    body: joi.object({
        name: genralRules.name,
        email: genralRules.email,
        password: genralRules.password,
        Repassword: genralRules.Repassword,
        phone: genralRules.phone,
        gender: genralRules.gender,
    }).options({ presence: "required" })

}
export const sigInSchema = {
    body: joi.object({
        email: genralRules.email,
        password: genralRules.password,
    }).options({ presence: "required" }),

}

export const updateProfileSchema = {
    body: joi.object({
        name: genralRules.name,
        phone: genralRules.phone,
        gender: genralRules.gender,
    }).min(1).messages({
        "object.min": "You must provide at least one field: name, phone, or gender.",
    }),
    headers: joi.object({
        authorization:genralRules.headers.required(),
        "content-type": joi.string().optional(),
        "user-agent": joi.string().optional(),
        accept: joi.string().optional(),
        "cache-control": joi.string().optional(),
        "postman-token": joi.string().optional(),
        host: joi.string().optional(),
        "accept-encoding": joi.string().optional(),
        connection: joi.string().optional(),
        "content-length": joi.string().optional(),
    }).unknown(false), 
}





export const updatePasswordSchema = {
    body: joi.object({
        password: genralRules.password,
        Repassword: genralRules.Repassword,
    }).min(1).messages({
        "object.min": "All fields are required: password and Repassword.",
    }),
    headers: joi.object({
        authorization: joi.string().required().messages({
            "any.required": "Authorization header is required.",
        }),
        "content-type": joi.string().optional(),
        "user-agent": joi.string().optional(),
        accept: joi.string().optional(),
        "cache-control": joi.string().optional(),
        "postman-token": joi.string().optional(),
        host: joi.string().optional(),
        "accept-encoding": joi.string().optional(),
        connection: joi.string().optional(),
        "content-length": joi.string().optional(),
    }).unknown(false), // يمنع الحقول غير المحددة
}



export const shereProfileSchema  = {
    params: joi.object({
        id: genralRules.ObjectId,
    }).required(),
}

















// headers:joi.object({
//     authorization: joi.string().required()
// })

// query:joi.object({
//    x: joi.string().required()
// })
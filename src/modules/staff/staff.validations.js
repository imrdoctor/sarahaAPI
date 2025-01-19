import joi from "joi";
import { genralRules } from "../../../utils/genralRules/genralRules.js";

export const freezeAccountSchema = {
    body: joi.object({
        id: genralRules.ObjectId.required(),
        reason: genralRules.freezeReson.required(),
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
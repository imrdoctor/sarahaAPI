import joi from "joi";
import { genralRules } from "../../../utils/genralRules/genralRules.js";
export const sendMessageSchema = {
    body: joi.object({
        id: genralRules.ObjectId.required(),
        content: genralRules.messageContent.required(),
    }).options({ presence: "required" }),
}

export const getMessageByIdSchema = {
    params: joi.object({
        id: genralRules.ObjectId.required(),
    }).options({ presence: "required" }),
}

export const FavoriteMessageByIdSchema = {
    params: joi.object({
        mid: genralRules.ObjectId.required(),
    }).options({ presence: "required" }),
}

export const getFavoriteMessages = {
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
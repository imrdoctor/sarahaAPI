import { Router } from "express";
import { getMessages, getMessagesById, favoriteMessage, sendMessage, getFavoriteMessages } from "./message.service.js";
import {   getMessageByIdSchema, FavoriteMessageByIdSchema, sendMessageSchema } from "./message.validations.js";
import { validation } from "../../middleware/validation.js";
import { authFreeze, authorization } from "../../middleware/auth.js";
const messageController = Router();
messageController.post('/send',validation(sendMessageSchema),sendMessage)
messageController.get('/getall',authorization,authFreeze(),getMessages)
messageController.get('/get/:id',validation(getMessageByIdSchema),authorization,authFreeze(),getMessagesById)
messageController.get('/favorit/:mid',validation(FavoriteMessageByIdSchema),authorization,authFreeze(),favoriteMessage)
messageController.get('/favorits',validation(getFavoriteMessages),authorization,authFreeze(),getFavoriteMessages)
export default messageController;
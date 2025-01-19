import { Router } from "express";
import { actve, confirmEmail, getProfile, login, shereProfile, signUp, updatePassword, updateProfile } from "./user.service.js"
import { authFreeze, authorization, authRole, confirmEmailFirst } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { shereProfileSchema, sigInSchema, signUpSchema, updatePasswordSchema, updateProfileSchema } from "./user.validations.js";
import { defaultRoles } from "../../DB/models/models.js";
const userController = Router();
userController.post('/signup',validation(signUpSchema),signUp)
userController.post('/login',validation(sigInSchema),login)
userController.post('/confirm',authorization,authRole(Object.values(defaultRoles)),authFreeze(),confirmEmail)
userController.post('/profile',authorization,authRole(Object.values(defaultRoles)),confirmEmailFirst(),authFreeze(),getProfile)
userController.patch('/update',validation(updateProfileSchema),authorization,authRole(Object.values(defaultRoles)),confirmEmailFirst(),authFreeze(),updateProfile)
userController.patch('/update/password',validation(updatePasswordSchema),authorization,authRole(Object.values(defaultRoles)),confirmEmailFirst(),authFreeze(),updatePassword)
userController.post('/shere/:id',validation(shereProfileSchema),shereProfile)
userController.get('/actve/:encryptedactivetoken',actve);
export default userController;
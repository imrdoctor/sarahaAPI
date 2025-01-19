import { Router } from "express";
import { freezeAccount, unFreezeAccount} from "./staff.service.js"
import { authFreeze, authorization, authRole, confirmEmailFirst } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { freezeAccountSchema} from "./staff.validations.js";
import { defaultRoles } from "../../DB/models/models.js";
const staffController = Router();
staffController.post('/freeze',validation(freezeAccountSchema),authorization,authRole(Object.values({role:defaultRoles.admin})),authFreeze(),freezeAccount)
staffController.post('/unfreeze',validation(freezeAccountSchema),authorization,authRole(Object.values({role:defaultRoles.admin})),authFreeze(),unFreezeAccount)
export default staffController;
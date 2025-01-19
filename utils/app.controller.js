import { connectionDB } from "../src/DB/connectionDB.js"
import messageController from "../src/modules/message/message.controller.js";
import staffController from "../src/modules/staff/staff.controller.js";
import userController from "../src/modules/user/user.controller.js";
import { globalErrorHandler } from "./error/errorHndelar.js";
import  cors from 'cors'

const approotes = async (app, express) => {
    app.use(cors())
    app.use(express.json())
    connectionDB()
    app.get('/', (req, res) => {
       return res.status(200).json({msg:"Welcome in Sara7a API"})
    })
    app.use("/user", userController);
    app.use("/staff", staffController);
    app.use("/message", messageController);
    app.use("*", (req, res, next) => {
        return next(new Error(`invalid url ${req.originalUrl}`, { cause: { status: 404} }))
    })
    app.use(globalErrorHandler);


}

export default approotes
import dotenv from 'dotenv';
dotenv.config();
import { EventEmitter } from 'events'
import jwt from "jsonwebtoken";
import { encryption } from '../crypt/encrypt.js';
import { sendEmail } from '../../src/service/sendEmail.js';
export const eventEmitter = new EventEmitter()
eventEmitter.on("sendActiveEmails", async (data) => {
    let email;
    if (data) {
        email = data.email;
    }
    try {
        const activetoken = jwt.sign({ email }, process.env.SIGNATURE_TOKEN_CONFIRMATION, { expiresIn: '2m' })
        const encryptedactivetoken = await encryption({ value: activetoken, key: process.env.SIGNATURE_TOKEN_ENCRYPT });
        const safeEncryptedToken = encodeURIComponent(encryptedactivetoken);
        const linkAuth = `https://saraha-api.vercel.app/user/actve/${safeEncryptedToken}`
        const emailSender = await sendEmail(email, "Active Your Email", "Confirm Your Email", `<a href=${linkAuth}>Conferm Your Email</a>`)
    } catch (error) {

        console.error(
            `Error sending email to ${email}:`,
            {
                message: error.message,
                stack: error.stack,
                name: error.name,
                fullError: error
            }
        );
    }
})
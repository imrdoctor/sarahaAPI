import dotenv from 'dotenv';
dotenv.config();
import nodemailer from "nodemailer"

export const sendEmail = async (to, title , subject, html,  attachments) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // TLS
        auth: {
            user: process.env.AUTH_EMAIL,
            pass: process.env.AUTH_EMAIL_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false, // لتجنب مشاكل الشهادات
        },
    });
    const info = await transporter.sendMail({
        from: `${title} ${process.env.AUTH_EMAIL}`,
        to: to ? to : null,
        subject: subject,
        html: html ? html : null,
        attachments: attachments ? attachments : [],
    });
    if (info.accepted && info.accepted.length > 0) {
        return true;
    }else {
        return false;
    }    
    
}


// MTE4Mzc5NDI50DIZMJI1NDU5Nw.GyNSRL.kygfb3jz0ATAfdk-ETbvqrdUSDTToR4ikXgwe8
// MTE4Mzc5NDI50DIzmjI1NDU5Nw.GyNSRL.kygfb3jz0ATAfdk-ETbvqrdusdTToR4ikXgwe8
// MTE4MZC5NDI50DIzMjI1NDU5Nw.GyNSRL.Kygfb3jz0ATAfdK-ETbvqrdUSDTToR4ikXgwe8
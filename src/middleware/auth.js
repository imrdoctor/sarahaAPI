import dotenv from 'dotenv';
import { asyncHndelar, decryption, verifyToken } from '../../utils/utils.js';
import userModel from '../DB/models/user/user.model.js';

dotenv.config();
export const authorization = async (req, res, next) => {
    try {
        const authorization = req.header('Authorization');
        if (!authorization) {
            return next(new Error("No token, authorization denied", { cause: { status: 403 } }))
        }
        const [type, token] = authorization.split(' ') || [];
        if (type !== 'Admin' && type !== 'Bearer') {
            return next(new Error("Invalid token type", { cause: { status: 403 } }))
        }
        let decryptedToken;
        try {
            decryptedToken = await decryption({ value: token, key: process.env.encryptKey })
        } catch (decryptionError) {
            return next(new Error("invalid token", { cause: { status: 403 } }))
        }
        if (!decryptedToken) {
            return next(new Error("Token is not valid", { cause: { status: 403 } }))
        }
        if ((type !== 'Bearer' && type !== 'Admin') || !token) {
            return next(new Error("Token format is not valid", { cause: { status: 403 } }))
        }
        let verify;
        if (type === 'Bearer') {
            verify = await verifyToken({ value: decryptedToken, sign: process.env.SIGNATURE_TOKEN_USER })
        } else if (type === 'Admin') {
            verify = await verifyToken({ value: decryptedToken, sign: process.env.SIGNATURE_TOKEN_ADMIN })

        } else {
            return next(new Error("Token format is invalid", { cause: { status: 403 } }))
        }
        if (!verify.id) {
            return next(new Error("Token is not valid", { cause: { status: 403 } }))

        }
        const user = await userModel.findById({ _id: verify.id });
        if (verify.secret !== user.secret) {
            return next(new Error("Token is not valid", { cause: { status: 403 } }))
        }
        if (!user) {
            return next(new Error("User not found", { cause: { status: 403 } }))
        }
        req.user = user;
        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return next(new Error("Invalid Token", { cause: { status: 403 } }))
        }
        return next(new Error("You Are Not Authorization", { cause: { status: 403 } }))

    }
};

export const confirmEmailFirst = () => {
    return asyncHndelar((req, res, next) => {
        if (!req.user.confirmed) {
            return next(new Error("Please Confirm Your Email", { cause: { status: 403 } }));
        }
        next();
    });
};

export const authRole = (accessRole = []) => {
    return asyncHndelar((req, res, next) => {
        if (!req.user || !accessRole.includes(req.user.role)) {
            return next(new Error(`Access denied role ${req.user.role} `, { cause: { status: 403 } }));
        }
        next();
    });
};




export const authFreeze = () => {
    return asyncHndelar((req, res, next) => {
        if (req.user.freeze) {
            return next(new Error("Your Account is Freezed", { cause: { status: 403 } }));
        }
        next();
    });
};
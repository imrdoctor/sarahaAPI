import dotenv from 'dotenv';
import { asyncHndelar, decryption, encryption, eventEmitter, generateSecret, generateToken, getUserIP, hashCompare, hashing, verifyToken } from '../../../utils/utils.js';
import { sendEmail } from '../../service/sendEmail.js';
import userModel from '../../DB/models/user/user.model.js';

dotenv.config();
export const signUp = asyncHndelar(async (req, res, next) => {
    const { name, email, password, Repassword, gender, phone } = req.body;
    const exisingUser = await userModel.findOne({ email });
    if (exisingUser) {
        return next(new Error("Email already exists", { cause: { status: 400 } }))
    }
    // Hash password
    const saltRounds = parseInt(process.env.BYCRYPTSOLT_ROUNDS, 10);
    const hashedPassword = await hashing({ password, saltRounds });

    //Mobile phone Crypto Authentication
    const encryptedPhone = await encryption({ value: phone, key: process.env.encryptKey });
    const newuser = await userModel.create({ name, email, password: hashedPassword, gender, phone: encryptedPhone })
    eventEmitter.emit("sendActiveEmails", { email })
    return res.status(201).json({ msg: "User Created Successfully", newuser: { name: newuser.name, email: newuser.email, } })
})
export const confirmEmail = asyncHndelar(
    async (req, res, next) => {
        const user = req.user;
        if (user.confirmed) {
            return next(new Error("Email already confirmed", { cause: { status: 400 } }))
        }
        eventEmitter.emit("sendActiveEmails", { email: user.email });
        return res.status(201).json({ msg: "Active Email Sent Successfully", email: user.email });
    })
export const actve = asyncHndelar(
    async (req, res, next) => {
        const encryptedactivetoken = decodeURIComponent(req.params.encryptedactivetoken);
        if (!encryptedactivetoken) {
            return res.status(401).json({ message: "No token provided" });
        }
        let decryptedToken;
        try {
            decryptedToken = await decryption({ value: encryptedactivetoken, key: process.env.SIGNATURE_TOKEN_ENCRYPT })

        } catch (error) {
            return next(new Error(`Invalid Confrmetion url 1`, { cause: { status: 401 } }))
        }
        let token;
        try {
            token = await verifyToken({ value: decryptedToken, sign: process.env.SIGNATURE_TOKEN_CONFIRMATION })

        } catch (error) {
            // if token error token is expired
            if (error.name === 'TokenExpiredError') {
                return next(new Error(`This confrmation Url is Expired`, { cause: { status: 401 } }))
            }

            return next(new Error(`Invalid Confrmetion url 2`, { cause: { status: 401 } }))
        }
        if (!token.email) {
            return next(new Error(`Invalid token`, { cause: { status: 401 } }))
        }
        const user = await userModel.findOne({ email: token.email });
        if (!user) {
            return next(new Error(`User not found`, { cause: { status: 401 } }))
        }
        if (user.confirmed == true) {
            return next(new Error(`User is already active`, { cause: { status: 401 } }))
        }
        // active
        user.confirmed = true;
        await user.save();
        // send welcome email
        const welcomeEmail = await sendEmail(user.email, "Welcome To Saraha App", "Welcome To Saraha", `<h1>Welcome ${user.name}</h1>`)
        return res.status(200).json({ msg: "User activated successfully", user: { name: user.name, email: user.email } });
    })
export const login = asyncHndelar(
    async (req, res, next) => {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email })
        if (!user) {
            return next(new Error(`Invalid email or password`, { cause: { status: 401 } }))
        }
        const isValidPassword = await hashCompare({ cruunt: password, old: user.password });
        if (!isValidPassword) {
            return next(new Error(`Invalid email or password`, { cause: { status: 401 } }))
        }
        if (user.freeze) {
            return next(new Error("Your Account is Freezed", { cause: { status: 403 } }));
        }
        // هستخدمه بعدين اني اضيف حمايه للحساب
        const userIP = getUserIP(req);
        user.lastloginIP = userIP;
        await user.save();
        // 
        let secret = user.secret ? user.secret : await generateSecret()
        const signKey = user.role === "user" ? process.env.SIGNATURE_TOKEN_USER : process.env.SIGNATURE_TOKEN_ADMIN;
        const payload = { id: user._id, secret: secret };
        const expiresIn = process.env.TOKEN_EXPIRATION || undefined;
        const token = await generateToken({ payload, signKey, expiresIn });
        await userModel.findByIdAndUpdate(user._id, { secret: secret }, { new: true });
        const encryptedToken = await encryption({ value: token, key: process.env.encryptKey });
        return res.status(201).json({ msg: "Logged In Successfully", encryptedToken });
    })

export const getProfile = asyncHndelar(
    async (req, res, next) => {

        const user = req.user;
        const decryptedPhoneNumber = await decryption({ value: user.phone, key: process.env.encryptKey });
        return res.status(200).json({
            msg: "User Profile",
            user: {
                name: user.name,
                email: user.email,
                phone: decryptedPhoneNumber,
                gender: user.gender,
                createdAt: user.createdAt
            }
        });

    }
);

export const updateProfile = asyncHndelar(
    async (req, res, next) => {
        const { phone, gender, name } = req.body
        if (req.body.phone) {
            req.body.phone = await encryption({ value: req.body.phone, key: process.env.encryptKey });
        }
        let newUserUpdated = await userModel.findByIdAndUpdate(req.user._id, req.body, { new: true });
        const updatedData = { name, phone, gender }
        return res.status(200).json({ msg: "Profile Updated Successfully", updatedData });
    }
)
export const updatePassword = asyncHndelar(
    async (req, res, next) => {
        const email = req.user.email;
        const user = await userModel.findOne({ email })
        if (req.body.password) {
            const saltRounds = parseInt(process.env.BYCRYPTSOLT_ROUNDS, 10);
            req.body.password = await hashing({ password: req.body.password, saltRounds });
        }
        const secret = await generateSecret();
        const signKey = user.role === "user" ? process.env.SIGNATURE_TOKEN_USER : process.env.SIGNATURE_TOKEN_ADMIN;
        const payload = { id: user._id, secret: secret };
        const expiresIn = process.env.TOKEN_EXPIRATION || undefined;
        const token = await generateToken({ payload, signKey, expiresIn });
        await userModel.findByIdAndUpdate(req.user._id, { password: req.body.password, secret: secret }, { new: true });
        const encryptedToken = await encryption({ value: token, key: process.env.encryptKey });
        return res.status(200).json({ msg: "Password Updated Successfully", encryptedToken });
    }
);

export const shereProfile = asyncHndelar(
    async (req, res, next) => {        
        const user = await userModel.findById(req.params.id).select("name id");
        user ? res.status(200).json({ msg: "User Profile", user}) : next(new Error("User not found", { cause: { status: 404 } }));
    }
);
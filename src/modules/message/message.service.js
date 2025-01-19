import dotenv from 'dotenv';
import { asyncHndelar } from '../../../utils/utils.js';
import userModel from '../../DB/models/user/user.model.js';
import messageModel from '../../DB/models/message/message.model.js';
dotenv.config();
export const sendMessage = asyncHndelar(
    async (req, res, next) => {
        const { content, id } = req.body;
        const user = await userModel.findById(id);
        if (!user) {
            return next(new Error("User not found", { cause: { status: 404 } }))
        }
        await messageModel.create({ content, to: id });
        return res.status(200).json({ msg: "Message sent successfully", content: content });
    }
);
// get All message
export const getMessages = asyncHndelar(
    async (req, res, next) => {
        const messages = await messageModel.find({ to: req.user._id });
        return res.status(200).json({ msg: "Messages", messages, messagesCount: messages.length });
    }
);


export const getMessagesById = asyncHndelar(
    async (req, res, next) => {
        const { msgID } = req.params
        const user = req.user
        const messages = await messageModel.findOne({ msgID });
        if (!messages) {
            return next(new Error("Message not found", { cause: { status: 404 } }));
        }
        if (messages.to.toString() !== user._id.toString()) {
            return next(new Error("You are not authorized to view this message", { cause: { status: 403 } }));
        }

        return res.status(200).json({ msg: "Messages", messages, messagesCount: messages.length });
    }
);



// export const likeMessage = asyncHndelar(
//     async (req, res, next) => {
//         const {mid} = req.params
//         const messages = await messageModel.findById({_id:mid});
//         messages.favorite ? messages.favorite = true : messages.favorite = false;
//         if (!messages) {
//             return next(new Error("Message not found", { cause: { status: 404 } }));
//         }
//         await messages.save();
//         if(messages.favorite){
//             return res.status(200).json({ msg: "Message removed from favorite successfully" });
//         }
//         return res.status(200).json({ msg: "Message add to favorite successfully" });
//     }
// );

export const favoriteMessage = asyncHndelar(
    async (req, res, next) => {
        const { mid } = req.params;
        const user = req.user;
        const message = await messageModel.findById(mid);
        if (!message) {
            return next(new Error("Message not found", { cause: { status: 404 } }));
        }

        if (message.to.toString() !== user._id.toString()) {
            return next(new Error("You are not authorized to this message", { cause: { status: 403 } }));
        }

        message.favorite = !message.favorite;

        await message.save();

        if (message.favorite) {
            return res.status(200).json({ msg: "Message add to favorite successfully", content: message.content});
        }
        return res.status(200).json({ msg: "Message removed from favorite  successfully", content: message.content});
    }
);



export const getFavoriteMessages = asyncHndelar(
    async (req, res, next) => {
        const user = req.user;
        const messages = await messageModel.find({to:user.id, favorite: true});
        if (messages.length === 0) {
            return next(new Error("Not Have Favorit Messages", { cause: { status: 404 } }));
        }
        return res.status(200).json({msg: "Favorite messages",messages,messagesCount: messages.length,});
    }
);
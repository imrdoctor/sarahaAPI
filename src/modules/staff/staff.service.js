import dotenv from 'dotenv';
import { asyncHndelar } from '../../../utils/utils.js';
import userModel from '../../DB/models/user/user.model.js';
import unFreezeHistoryModel from '../../DB/models/freeze/unfreezeHistory.mode.js';
import freezeHistoryModel from '../../DB/models/freeze/freezeHistory.mode.js';
dotenv.config();
export const freezeAccount = asyncHndelar(
    async (req, res, next) => {
        const user = req.user;
        const {id , reason } = req.body;
        if (user._id == id) {
            return res.status(400).json({ msg: "You can't freeze your own account" })
        }
        const accountFreeze = await userModel.findById(id);
        if (!accountFreeze) {
            return res.status(404).json({ msg: "Account not found" })
        }
        if (accountFreeze.freeze) {
            return res.status(400).json({ msg: "Account already freezed" })
        }
        // Freeze the account
        await userModel.findByIdAndUpdate(id, { 
            freeze: true, 
            freezeBy: user._id, 
            freezeAt: Date.now(),
            freezeesNum: accountFreeze.freezeesNum + 1 
        });

        // Save freeze history
        await freezeHistoryModel.create({
            user: accountFreeze._id,
            freezedBy: user._id,
            freezeesNum: accountFreeze.freezeesNum ? accountFreeze.freezeesNum + 1 : 1 ,
            reason: reason,
        });
        return res.status(200).json({ msg: "Account Freezed Successfully" });
    }
);
export const unFreezeAccount = asyncHndelar(
    async (req, res, next) => {
        const user = req.user;
        const {id , reason } = req.body;
        if (user._id == id) {
            return res.status(400).json({ msg: "You can't Un freeze your own account" })
        }
        const accountFreezed = await userModel.findById(id);
        if (!accountFreezed) {
            return res.status(404).json({ msg: "Account not found" })
        }
        if (!accountFreezed.freeze) {
            return res.status(400).json({ msg: "Account Not freezed" })
        }
        await userModel.findByIdAndUpdate(id, { 
            $unset: { 
                freeze: 1, 
                freezeBy: 1, 
                freezeAt: 1 
            },
        });
        await unFreezeHistoryModel.create({
            user: accountFreezed._id,
            unfreezedBy: user._id,
            unfreezeesNum: accountFreezed.freezeesNum ? accountFreezed.freezeesNum : 1 ,
            reason: reason,
        });
        return res.status(200).json({ msg: "Account Un Freezed Successfully" });
    }
);
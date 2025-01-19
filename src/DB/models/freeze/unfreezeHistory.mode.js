import mongoose from "mongoose";

const unFreezeHistorySchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    unfreezedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    reason: { 
        type: String, 
        default: null 
    },
    unfreezeesNum: { 
        type: Number, 
        default: 0 
    }
}, { 
    timestamps:true,
    versionKey: false,
 });

const unFreezeHistoryModel = mongoose.models.unFreezeHistory || mongoose.model("unFreezeHistory", unFreezeHistorySchema);

export default unFreezeHistoryModel;

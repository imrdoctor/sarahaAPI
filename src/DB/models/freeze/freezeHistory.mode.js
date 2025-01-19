import mongoose from "mongoose";

const freezeHistorySchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    freezedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    reason: { 
        type: String, 
        default: null 
    },
    freezeesNum: { 
        type: Number, 
        default: 0 
    }
}, { 
    timestamps:true,
    versionKey: false,

});

const freezeHistoryModel = mongoose.models.FreezeHistory || mongoose.model("FreezeHistory", freezeHistorySchema);

export default freezeHistoryModel;

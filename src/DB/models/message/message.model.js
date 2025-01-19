import mongoose from "mongoose";

const messageSchema= new mongoose.Schema({
    content:{
        type:String,
        required:true,
        minlength:1,
        maxlength:1000
    },
    to:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    favorite: {
        type: Boolean,
        default: false,
    },
},{
    timestamps:true,
    versionKey: false,
    
})

const messageModel =  mongoose.Model.Message || mongoose.model("Message",messageSchema);

export default messageModel;
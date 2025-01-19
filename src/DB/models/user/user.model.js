import mongoose from "mongoose";
export const defaultGenders = {
    male: "male",
    female:"female"
}
export const defaultRoles= {
    user:'user',
    admin:"admin"
}
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        lowercase:true,
        minlength:3,
        maxlength:50
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        match:/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    password:{
        type:String,
        required:true,
        minlength:8,
    },
    phone:{
        type:String,
        required:true,
        // match:/^01[0-2,5]\d{8}$/
    },
    confirmed:{
        type:Boolean,
        default:false,
    },
    gender:{
        type:String,
        enum:Object.values(defaultGenders),
        default:'other'
    },
    role:{
        type:String,
        enum:Object.values(defaultRoles),
        default:defaultRoles.user
    },
    secret: {
        type: String,
        default: null, 
    },
    freeze: {
        type: Boolean,
        default: false,
    },
    freezeBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        default: null
    },
    freezeAt: { 
        type: Date, 
        default: null 
    },    
    freezeesNum: { 
        type: Number, 
        default: 0 
    },
    lastloginIP: {
        type: String,
        default: "0.0.0.0",  
    },
},
{
    timestamps: true,
    versionKey: false,
}

)


const userModel = mongoose.models.User || mongoose.model("User",userSchema)

export default userModel;
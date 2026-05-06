import {Schema, model} from 'mongoose'

const userSchema = new Schema({
    username:{
        type:String,
        required:[true,"first name is required"]
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:[true,"email already exists"]
    },
    password:{
        type:String,
        required:[true,"password is mandatory"],
    },
    profileImageUrl:{
        type:String
    },
    isUserActive:{
        type:Boolean,
        default:true
    }
},{
    versionKey:false,
    timestamps:true,
    strict:"throw"
})

export const UserModel=model("user",userSchema);

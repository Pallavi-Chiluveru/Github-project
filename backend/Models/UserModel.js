import {Schema,model,Types} from 'mongoose'

const UserSchema=new Schema({
    username : {
        type:String,
        required:[true,"Username is required!"]
    },
    email : {
        type:String,
        required:[true,"Email is required"],
        unique:[true,"Email already exist"]
    },
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    repositories:[{
        type:Types.ObjectId,
        ref:"repo"
    }]
})

export const UserModel=model("user",UserSchema)
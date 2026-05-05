import {model,Schema, Types} from 'mongoose'

const RepositorySchema=new Schema({
    owner:{
        type:Types.ObjectId,
        ref:"user"
    },
    name:{
        type:String,
        required:[true,"Repo name is required!"]
    },
    description:{
        type:String
    },
    isPublic:{
        type:Boolean,
        default:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    collabrators:[{
        type:Types.ObjectId,
        ref:'user'
    }]
})
export const RepositoryModel=model("repo",RepositorySchema)
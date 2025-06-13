
import mongoose, { model,Schema,ObjectId, Types } from "mongoose";
const ContentTypes=['image','video','article','audio']

const UserSchema=new Schema({
    username:{type:String,required:true,unique:true},
    password:{type:String,required:true}
})
const ContentSchema=new Schema({
    link:{type:String,required:true},
    type:{type:String,enum:ContentTypes,required:true},
    title:{type:String,required:true},
    tags:[{type:Types.ObjectId,ref:'Tag'}],
    userId:{type:Types.ObjectId,ref:'User',required:true}
})

const TagsSchema=new Schema({
    title:{type:String,required:true,unique:true}
})

const LinksSchema=new Schema({
    hashedlink:{type:String,required:true,unique:true},
    userId:{type:Types.ObjectId,required:true,ref:'User'}
})

export const UserModel=model("User",UserSchema)
export const ContentModel=model("Content",ContentSchema)
export const TagsModel=model("Tags",TagsSchema)
export const LinksModel=model("Links",LinksSchema)
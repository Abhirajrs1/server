import mongoose from "mongoose";
const AdminSchema=new mongoose.Schema({
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
},
{
    timestamps:true
})
export const Admin =mongoose.model('Admin',AdminSchema)
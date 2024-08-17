import mongoose from "mongoose";
const ReviewSchema=new mongoose.Schema({
    reviewerName:{
        type:String
    },
    rating:{
        type:Number
    },
    comment:{
        type:String
    },
    reviewDate:{
        type:Date,
        default:Date.now
    },
    company:{
        type:mongoose.Schema.ObjectId,
        ref:'Company'
    }
},{
    timestamps:true
})

export const Review=mongoose.model('Review',ReviewSchema)
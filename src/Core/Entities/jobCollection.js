import mongoose from "mongoose";
const JobSchema=new mongoose.Schema({
    companyName:{
        type:String,
    },
    jobTitle:{
        type:String,
    },
    minPrice:{
        type:Number,
    },
    maxPrice:{
        type:Number,
    },
    jobLocation:{
        type:String,
    },
    yearsOfExperience:{
        type:Number,
    },
    employmentType:{
        type:String
    },
    delete:{
        type:Boolean,
        default:false
    },
    jobPostedOn:{
        type:Date,
        default:new Date
    },
    description:{
        type:String
    },
    jobPostedBy:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Recruiter' 
    },
    skills:{
        type:[]
    }
},
{
   timestamps:true 
})
export const Job =mongoose.model('Job',JobSchema)
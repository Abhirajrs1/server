import mongoose from "mongoose";
const ApplicationSchema=new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    contact:{
        type:Number
    },
    dob:{
        type:Date
    },
    totalExperience:{
        type:Number
    },
    currentCompany:{
        type:String
    },
    currentSalary:{
        type:Number
    },
    expectedSalary:{
        type:Number
    },
    preferredLocation:{
        type:String
    },
    city:{
        type:String,
    },
    jobId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Job'
    },
    applicant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    employerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Recruiter'
    },
    resume:{
        type:String
    },
},
{ timestamps: true }
)
export const Application = mongoose.model('Application', ApplicationSchema);


import mongoose from "mongoose";
const CompanySchema=new mongoose.Schema({
    companyName:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    contactNumber:{
        type:Number
    },
    typeOfCompany:{
        type:String
    },
    companyDescription:{
        type:String
    },
    website:{
        type:String
    },
    logo:{
        type:String
    },
    establishedYear:{
        type:String
    },
    headQuarters:{
        type:String
    },
    socialMedia:{
        linkedin:{
            type:String
        },
        twitter:{
            type:String
        },
        facebook:{
            type:String
        }
    },
    ceoName:{
        type:String
    },
    missionStatement:{
        type:String
    },
    role:{
        type:String,
        default:'company'
    },
    companyaddress:[{
        id:{
            type:String,
        },
        Buildingname:{
            type:String,
        },
        area:{
            type:String,
        },
        street:{
            type:String,
        },
        pincode:{
            type:Number,
        },
        city:{
            type:String,
        },
        state:{
            type:String,
        },
        country:{
            type:String
        },
    }],
    minEmployees:{
        type:Number
    },
    maxEmployees:{
        type:Number
    },
    registrationCertificate:{
        type:String
    },
    license:{
        type:String
    },
    taxCertificate:{
        type:String
    },
    reviewsId:[{
        type:mongoose.Schema.ObjectId,
        ref:'Review'
    }],
    block:{
        type:Boolean,
        default:false
    },
},{
    timestamps:true
})
export const Company=mongoose.model('Company',CompanySchema)
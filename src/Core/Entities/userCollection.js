import mongoose from "mongoose";
const UserSchema=new mongoose.Schema({
    username:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    googleId: {
        type: String, 

        sparse: true,
      },
    contact:{
        type:Number,
    },
    useraddress:[{
        id:{
            type:String,
        },
        Housename:{
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

    block:{
        type: Boolean,
        default:false,
    },
    role:{
        type:String,
        default:"user"
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    Qualification:{
        education:[
            {
            field:{
                type:String,
            },
            level:{
                type:String
            }
        },
    ],
        skills:[
            {
            userSkills:{
                type:String,
            },
            yearsOfExperience:{
                type:Number,
            },
        },
    ]   
    }
      },
{
    timestamps:true
})

export const User=mongoose.model('User',UserSchema)
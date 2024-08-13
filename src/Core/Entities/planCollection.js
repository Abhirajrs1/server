import mongoose from "mongoose";

const PlanSchema=new mongoose.Schema({
    planName:{
        type:String
    },
    amount:{
        type:Number
    },
    description:{
        type:String
    },
    planType:{
        type:String,
        enum:['duration','lifetime']
    },
    planDuration:{
        type:Number,
        required: function() {
            return this.planType === 'duration';
        }
    },
    list:{
        type:Boolean,
        default:true
    }
},{
    timestamps:true
})

export const Plans=mongoose.model('Plans',PlanSchema)
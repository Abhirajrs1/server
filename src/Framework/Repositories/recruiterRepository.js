import { Recruiter } from "../../Core/Entities/recruiterCollection.js";
import { TemperoryRecruiter } from "../../Core/Entities/temperoryRecruiterCollection.js";

const recruiterRepository={
       createRecruiter:async(recruiterData)=>{
        try {
            const newRecruiter=new TemperoryRecruiter(recruiterData)
            await newRecruiter.save()
            return newRecruiter
        } catch (error) {
            console.log(error);
        }
       },
       findRecruiterByEmail:async(email)=>{
        try {
            return await Recruiter.findOne({email:email})
        } catch (error) {
            console.log(error);
        }
       },
       findRecruiterByIdAndUpdate:async(id,value)=>{
        try {
            return await Recruiter.findByIdAndUpdate({_id:id},{password:value})
        } catch (error) {
            console.log("Error occured during",error);
        }
    },
       findTemperoryRecruiterByEmail:async(email)=>{
        try {
            return await TemperoryRecruiter.findOne({email:email})
        } catch (error) {
            console.log(error);
        }
       },
       updateRecruiterOtp:async(email,otp,expiration)=>{
        try {
            return TemperoryRecruiter.findOneAndUpdate({email:email},{$set:{otpCode:otp,otpExpiration:expiration}},{new:true})
        } catch (error) {
            console.log(error);
        }
       },
       moveTemperoryRecruiterToRecruiter:async(email)=>{
        try {
            const tempRecruiter=await TemperoryRecruiter.findOne({email:email})
            if(tempRecruiter){
                const permanentRecruiter=new Recruiter({
                    recruitername:tempRecruiter.recruitername,
                    email:tempRecruiter.email,
                    password:tempRecruiter.password
                })
                await permanentRecruiter.save()
                await TemperoryRecruiter.deleteOne({email:email})
                return permanentRecruiter
            }
        } catch (error) {
            console.log(error);
        }
       }
}

export default recruiterRepository
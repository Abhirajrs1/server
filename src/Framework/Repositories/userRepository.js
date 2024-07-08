
import { User } from "../../Core/Entities/userCollection.js";
import { TemperoryUser } from "../../Core/Entities/temperoryUserCollection.js";

const userRepository={
    
    createTemperoryUser: async(userData)=>{
        try {
            const newUser=new TemperoryUser(userData)
            await newUser.save()
            return newUser
        } catch (error) {
            console.log("Error occuring during",error);
        }
    },

    findUserByEmail:async(email)=>{
        try {
            return await User.findOne({email:email})
        } catch (error) {
            console.log("Error occured during",error);
        }
    },


    findTemperoryUserByEmail:async(email)=>{
        try {
           return await TemperoryUser.findOne({email:email})
        } catch (error) {
            console.log("Error occured during",error);
        }
    },



    updateContact:async(email,updatedUserContact)=>{
        try {
            return await User.findOneAndUpdate({email:email},updatedUserContact,{new:true})
        } catch (error) {
            console.log("Error occured during",error);
        }
   },


   addEducation:async(email,education)=>{
      try {
        return await User.findOneAndUpdate({email:email},{$push:{'Qualification.education':education}},{new:true})
      } catch (error) {
        console.log("Error occured during",error);
      }
   },

   addSkill:async(email,skill)=>{
    try {
        return await User.findOneAndUpdate({email:email},{$push:{'Qualification.skills':skill}},{new:true})
    } catch (error) {
        console.log("Error occured during",error);
    }
   },


    findUserByIdAndUpdate:async(id,value)=>{
        try {
            return await User.findByIdAndUpdate({_id:id},{password:value})
        } catch (error) {
            console.log("Error occured during",error);
        }
    },

    
    findUserById:async(userId)=>{
        try {
            return await User.findById({_id:userId})
        } catch (error) {
            console.log("Error occured during",error);
        }
    },

    updateUserOtp:async(email,otp,expiration)=>{
        return await TemperoryUser.findOneAndUpdate({email:email},{$set:{otpCode:otp,otpExpiration:expiration}},{new:true})
   },

    moveTemperoryToUser:async(email)=>{
        try {
            const tempUser=await TemperoryUser.findOne({email:email})
            if(tempUser){
                const permanentUser=new User({
                    username:tempUser.username,
                    email:tempUser.email,
                    password:tempUser.password
                })
                await permanentUser.save()
                await TemperoryUser.deleteOne({email:email})
                return permanentUser
            }
        } catch (error) {
            console.log("Error occured during",error);
        }
    },
    findUserByGoogleId:async(googleId)=>{
        try {
            return await User.findOne({googleId})
        } catch (error) {
            console.log("Error occured during",error);
        }
    },
    createUser:async(userData)=>{
        const newUser=new User(userData)
        return await newUser.save()
    }
}

export default userRepository
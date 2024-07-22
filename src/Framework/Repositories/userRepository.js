
import { User } from "../../Core/Entities/userCollection.js";
import { TemperoryUser } from "../../Core/Entities/temperoryUserCollection.js";
import logger from "../Utilis/logger.js";

const userRepository={
    
    // Create temperory user
    createTemperoryUser: async(userData)=>{
        try {
            const newUser=new TemperoryUser(userData)
            await newUser.save()
            logger.info(`Temperory user created: ${userData.email}`);
            return newUser
        } catch (error) {
            logger.error(`Error during temperory user creation: ${error.message}`);
        }
    },

    // Find user by email
    findUserByEmail:async(email)=>{
        try {
            let user=await User.findOne({email:email})    
            logger.info(`User found by email: ${email}`);
            return user
        } catch (error) {
            logger.error(`Error during finding user by email: ${email}, error: ${error.message}`);
        }
    },

    // Find temperory user by email
    findTemperoryUserByEmail:async(email)=>{
        try {
           let temperoryUser=await TemperoryUser.findOne({email:email})
           logger.info(`Temperory user found by email: ${email}`);
           return temperoryUser
        } catch (error) {
            logger.error(`Error during finding temperory user by email: ${email}, error: ${error.message}`);
        }
    },

    // Update user contact details
    updateContact:async(email,updatedUserContact)=>{
        try {
            const user=await User.findOneAndUpdate({email:email},updatedUserContact,{new:true})
            logger.info(`User contact updated for email: ${email}`);
            return user
        } catch (error) {
            logger.error(`Error during updating user contact for email: ${email}, error: ${error.message}`);
        }
   },

    // Add education details of user
   addEducation:async(email,education)=>{
      try {
        let user=await User.findOneAndUpdate({email:email},{$push:{'Qualification.education':education}},{new:true})
        logger.info(`Education added for email: ${email}`);
        return user
      } catch (error) {
        logger.error(`Error during adding education for email: ${email}, error: ${error.message}`);
      }
   },

    // Add skills of user
   addSkill:async(email,skill)=>{
    try {
        let user=await User.findOneAndUpdate({email:email},{$push:{'Qualification.skills':skill}},{new:true})
        logger.info(`Skill added for email: ${email}`);
        return user
    } catch (error) {
        logger.error(`Error during adding skill for email: ${email}, error: ${error.message}`);
    }
   },

    // Find user by id and update password
    findUserByIdAndUpdate:async(id,value)=>{
        try {
           let user=await User.findByIdAndUpdate({_id:id},{password:value})
           logger.info(`User password updated for ID: ${id}`);
           return user
        } catch (error) {
            logger.error(`Error during updating user password for ID: ${id}, error: ${error.message}`);
        }
    },

    // Find user by id
    findUserById:async(userId)=>{
        try {
            let user=await User.findById({_id:userId})
            logger.info(`User found by ID: ${userId}`);
            return user
        } catch (error) {
            logger.error(`Error during finding user by ID: ${userId}, error: ${error.message}`);
        }
    },

    // Update otp
    updateUserOtp:async(email,otp,expiration)=>{
        try {
            let temperoryUser=await TemperoryUser.findOneAndUpdate({email:email},{$set:{otpCode:otp,otpExpiration:expiration}},{new:true})
            logger.info(`OTP updated for email: ${email}`);
            return temperoryUser
        } catch (error) {
            logger.error(`Error during updating OTP for email: ${email}, error: ${error.message}`); 
        }
   },

    // Move from temperoryUser to permanent user
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
                logger.info(`Temperory user moved to permanent user: ${email}`);
                return permanentUser
            }
        } catch (error) {
            logger.error(`Error during moving temperory user to permanent user: ${email}, error: ${error.message}`);
        }
    },

    findUserByGoogleId:async(email)=>{
        try {
            const user=await User.findOne({email});
            logger.info(`User found by Google ID: ${email}`);
            return user;
        } catch (error) {
            logger.error(`Error during finding user by Google ID: ${email}, error: ${error.message}`);
        }
    },
    createUser:async(userData)=>{
        try {
            const newUser=new User(userData)
            await newUser.save()
            logger.info(`User created: ${userData.email}`);
            return newUser
        } catch (error) {
            logger.error(`Error during user creation: ${userData.email}, error: ${error.message}`);
        }
    }
}

export default userRepository
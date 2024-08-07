
import { User } from "../../Core/Entities/userCollection.js";
import { TemperoryUser } from "../../Core/Entities/temperoryUserCollection.js";
import { Resume } from "../../Core/Entities/resumeCollection.js";
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
   findResumeCandidateByIdAndUpdate:async(id,resumeData)=>{
    try {
        const resume=await Resume.findOneAndUpdate({candidate:id},resumeData,{new:true})
        if (resume) {
            logger.info(`Resume found and updated for candidate ID: ${id}`);
        } else {
            logger.info(`No resume found for candidate ID: ${id}`);
        }
        return resume;
    } catch (error) {
        logger.error(`Error during finding and updating resume for candidate ID: ${id}, error: ${error.message}`);    }
   },
   createResume:async(resumeData)=>{
    try {
        const resume = new Resume(resumeData);
        await resume.save();
        logger.info(`Created new resume for candidate ID: ${resumeData.candidate}`);
        return resume;
    } catch (error) {
        logger.error(`Error during creating resume for candidate ID: ${resumeData.candidate}, error: ${error.message}`);
    }
   },

   addResumeEducation:async(id,education)=>{
    try {
        const resume=await Resume.findOneAndUpdate({candidate:id},{$push:{education:education}},{ new: true, upsert: true })
        logger.info(`Education added to resume for candidate ID: ${id}`);
        return resume;
    } catch (error) {
        logger.error(`Error during adding education to resume for candidate ID: ${id}, error: ${error.message}`);
    }

   },
   getResumeEducation:async(id)=>{
    try {
        const resume=await Resume.findOne({candidate:id})
        logger.info(`Education details found for candidate ID: ${id}`);
        return resume.education;
    } catch (error) {
        logger.error(`Error during fetching education details for candidate ID: ${id}, error: ${error.message}`);
    }
   },
   addResumeSkill:async(id,skill)=>{
    try {
        const resume=await Resume.findOneAndUpdate({candidate:id},{$push:{skills:skill}},{ new: true, upsert: true })
        logger.info(`SKills added to resume for candidate ID: ${id}`);
        return resume;
    } catch (error) {
        logger.error(`Error during adding skill to resume for candidate ID: ${id}, error: ${error.message}`);
    }
   },
   getResumeSkill:async(id)=>{
    try {
        const resume=await Resume.findOne({candidate:id})
        logger.info(`Skill details found for candidate ID: ${id}`);
        return resume.skills;
    } catch (error) {
        logger.error(`Error during fetching skill details for candidate ID: ${id}, error: ${error.message}`);
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
   addDescription:async(id,description)=>{
    try {
        let result=await User.findOneAndUpdate({_id:id},{description:description},{new:true})
        if(!result){
            logger.warn(`Add description failed for user ID: ${id}`);
            return { message: "Failed to add description" };
        }else{
            logger.info(`Description added successfully for user ID: ${id}`);
            return result
        }
    } catch (error) {
        logger.error(`Add description error for user ID: ${id}, error: ${error.message}`)
    }
   },
   getDescription:async(id)=>{
    try {
        let result=await User.findById({_id:id})
        if (result) {
            logger.info(`Description found for user with ID: ${id}`);
            return result.description;
        } else {
            logger.warn(`No user found with ID: ${id}`);
            return null;
        }  
      } catch (error) {
        logger.error(`Error fetching description for user with ID: ${id}`, error);
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
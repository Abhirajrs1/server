import userRepository from "../../Framework/Repositories/userRepository.js";
import generateOTP from "../../Framework/Services/otpServices.js";
import EmailService from "../../Framework/Services/mailerServices.js";
import { generateJWT } from "../../Framework/Services/jwtServices.js";
import { generateRefreshToken } from "../../Framework/Services/jwtServices.js";
import sendEmail from "../../Framework/Services/forgotPasswordMail.js";
import uploadFileToS3 from "../../Framework/Services/s3.js";
import logger from "../../Framework/Utilis/logger.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
dotenv.config()

const emailService=new EmailService()

const userUseCase={

    // User signup
    userSignUp:async(userData)=>{
        try {
            const {username,email,password}=userData
            const existingUser=await userRepository.findUserByEmail(email)
                if(existingUser){
                    logger.warn(`Signup failed for email: ${email}, reason: User already registered`)
                    return {message:"User already registered"}
            }
            const hashPassword=await bcrypt.hash(password,10)
            const otp=generateOTP()
            const expiration = new Date(Date.now() + 5 * 60 * 1000); 
            const newUser=await userRepository.createTemperoryUser({
                username:username,
                email:email,
                password:hashPassword,
                otpCode:otp,
                otpExpiration:expiration
            })
            await emailService.sendOtpEmail(email,otp)
            logger.warn(`User signup successfully: ${email}`)
            return newUser
        } catch (error) {   
            logger.error(`Signup error for email: ${userData.email}, error: ${error.message}`);
        }
    },

    // Otp verification
    verifyOtp: async(email,otp)=>{
        try {
           const user=await userRepository.findTemperoryUserByEmail(email) 
           if(!user){
            logger.warn(`OTP verification failed for the email: ${email}, reason: Temperory user not found`)
            return {message:'Temperory user not found'}
           }
           if(user.otpCode==otp && user.otpExpiration>Date.now()){
            await userRepository.moveTemperoryToUser(email)
            logger.info(`OTP verification success for the email: ${email} `)
            return true
           }
        } catch (error) {
            logger.error(`OTP verification error for email: ${email}, error: ${error.message}`);
        }
    },

    // Resend otp
    resentOtp:async(email)=>{
        try {
            const otp=generateOTP()
            const expiration = new Date(Date.now() + 5 * 60 * 1000); 
            await userRepository.updateUserOtp(email,otp,expiration)
            await emailService.sendOtpEmail(email,otp)
            logger.info(`OTP resend successfully to email: ${email}`)
            return true
        } catch (error) {
            logger.error(`Resend OTP error for email: ${email}, error: ${error.message}`);
        }
    },

    // User login
    userlogin:async(userData)=>{
        try {
            const {email,password}=userData
           const user=await userRepository.findUserByEmail(email)
           if(!user){
            logger.warn(`Login failed for email: ${email}, reason: User not found`)
            return { message:"User not found" }
           }
           const valid=await bcrypt.compare(password,user.password)
           if(!valid){
            logger.warn(`Login failed for email: ${email}, reason: Incorrect password`)
            return {message:"Incorrect password"}
           }
           const token=await generateJWT(user.email,user.role)
           const refreshToken=await generateRefreshToken(user.email)
           logger.info(`User login successfully ${email}`)
           return {user,token,refreshToken}
        } catch (error) {
            logger.error(`Login error for email: ${email}, error: ${error.message}`);        }
    },

    // Forgot password
    forgotPassword:async(email)=>{
        try {
            const user=await userRepository.findUserByEmail(email)
                if(!user){
                    logger.warn(`Forgot password failed for email: ${email}, reason: User not found`)
                    return {message:"User not found"}
                }
                const token = jwt.sign({ id:user._id }, process.env.KEY, { expiresIn: '1h' });
                sendEmail(token,user.email)
                logger.info(`Forgot password email sent to: ${email}`);
                return {message:"Check our email for reset password link"}
        } catch (error) {
            logger.error(`Forgot password error for email: ${email}, error: ${error.message}`);
        }
    },

    // Reset password
    resetPassword:async(token,password)=>{
        try {
            const decoded=jwt.verify(token,process.env.KEY)
            const id=decoded.id
            const hashPassword=await bcrypt.hash(password,10)
            const user=await userRepository.findUserByIdAndUpdate(id,hashPassword)
            if(!user){
                logger.warn(`Reset password failed, reason: User not found`);
                return {message:"User not found, so password doesn't change"}
            }else{
                logger.info(`Password reset successfully for user ID: ${id}`);
                return {message:"Password successfully changed"}
            }
        } catch (error) {
            logger.error(`Reset password error, token: ${token}, error: ${error.message}`);
        }
    },

    // Get user by email
    getUserByEmail:async(email)=>{
        try {
            const user= await userRepository.findUserByEmail(email)
            if(!user){
                logger.warn(`Get user failed for email: ${email}, reason: User not found`);
                return {message:"User not found"}
            }else{
                logger.info(`User found successfully for email: ${email}`);
                return {user}
            }
        } catch (error) {
            logger.error(`Get user error for email: ${email}, error: ${error.message}`);   
        }  
    },

    // Update user details
    updateUser:async(email,updatedUserContact)=>{
        try {
            const user=await userRepository.updateContact(email,updatedUserContact)
            if(!user){
                logger.warn(`Update user failed for email: ${email}, reason: User not found`);
                return {message:"User not found"}
            }else{
                logger.info(`User contact details updated successfully for email: ${email}`);
                return {message:"User contact details updated successfully",user}
            }
        } catch (error) {
            logger.error(`Update user error for email: ${email}, error: ${error.message}`);
        }
    },
    
    updateResume:async(resumeData)=>{
        try {
            const resume=await userRepository.findResumeCandidateByIdAndUpdate(resumeData.candidate,resumeData)
            if(!resume){
                resume=await userRepository.createResume(resumeData)
                logger.info(`Created new resume for candidate ID: ${resumeData.candidate}`);
            }else{
                logger.info(`Updated resume for candidate ID: ${resumeData.candidate}`);
            }
            return resume

        } catch (error) {
            logger.error(`Failed to update or create resume for candidate ID: ${resumeData.candidate} - ${error.message}`);
        }
    },
    addResumeEducation:async(id,education)=>{
        try {
            const resumeEducation=await userRepository.addResumeEducation(id,education)
            if (!resumeEducation) {
                logger.warn(`Add education failed for candidate ID: ${id}`);
                return { message: "Failed to add education to resume" };
            } else {
                logger.info(`Education added successfully for candidate ID: ${id}`);
                return { message: "Education added successfully", resume: resumeEducation };
            }
        } catch (error) {
            logger.error(`Add education error for candidate ID: ${id}, error: ${error.message}`);
        }
    },
    getResumeEducation:async(id)=>{
        try {
            const education=await userRepository.getResumeEducation(id)
            if(education){
                logger.info(`Education details successfully retrieved for candidate ID: ${id}`);
                return education
            }else{
                logger.warn(`No education details found for candidate ID: ${id}`);
                return {message: "No education details found for the given candidate ID" };
            }
        } catch (error) {
            logger.error(`Error getting education by candidate ID: ${id}, error: ${error.message}`);
            return { success: false, message: "Internal server error" };
        }
    },
    addResumeSkill:async(id,skill)=>{
        try {
            const resumeSkill=await userRepository.addResumeSkill(id,skill)
            if (!resumeSkill) {
                logger.warn(`Add skill failed for candidate ID: ${id}`);
                return { message: "Failed to add skill to resume" };
            } else {
                logger.info(`Skill added successfully for candidate ID: ${id}`);
                return { message: "Skills added successfully", skill: resumeSkill };
            }
        } catch (error) {
            logger.error(`Add skill error for candidate ID: ${id}, error: ${error.message}`);
        }
    },
    getResumeSkill:async(id)=>{
        try {
            const skill=await userRepository.getResumeSkill(id)
            if(skill){
                logger.info(`Skill details successfully retrieved for candidate ID: ${id}`);
                return skill
            }else{
                logger.warn(`No skill details found for candidate ID: ${id}`);
                return {message: "No skill details found for the given candidate ID" };
            }
        } catch (error) {
            logger.error(`Error getting skill by candidate ID: ${id}, error: ${error.message}`);
            return { success: false, message: "Internal server error"};
        }
    },


    // Add education details
    addEducation:async(email,education)=>{
        try {
            const user=await userRepository.addEducation(email,education)
            if(!user){
                logger.warn(`Add education failed for email: ${email}, reason: User not found`);
                return {message:"User not found"}
            }else{
                logger.info(`User education added successfully for email: ${email}`);
                return {message:"User education added successfully",user}
            }
        } catch (error) {
            logger.error(`Add education error for email: ${email}, error: ${error.message}`);
        }
    },

    // Add skills of user
    addSkill:async(email,skill)=>{
        try {
            const user=await userRepository.addSkill(email,skill)
            if(!user){
                logger.warn(`Add skill failed for email: ${email}, reason: User not found`);
                return {message:"User not found"}
            }else{
                logger.info(`User skill added successfully for email: ${email}`);
                return {message:"User skill added successfully",user}
            }
        } catch (error) {
            logger.error(`Add skill error for email: ${email}, error: ${error.message}`);
        }
    },
    addDescription:async(id,description)=>{
        try {
            const result=await userRepository.addDescription(id,description)
            if(!result){
                logger.warn(`Add description failed for candidate ID: ${id}`);
                return { message: "Failed to add description to resume" };
            }else{
                logger.info(`Description added successfully for candidate ID: ${id}`);
                return result
            }
        } catch (error) {
            logger.error(`Add description error for candidate ID: ${id}, error: ${error.message}`);
        }
    },
    getDescription:async(id)=>{
        try {
            const result=await userRepository.getDescription(id)
            if(!result){
                logger.warn(`No description found for user with ID: ${id}`);
                return {message:"No description found"}
            }else{
                logger.info(`Description found for user with ID: ${id}`);
                return result;
            }
        } catch (error) {
            logger.error(`Error fetching description for user with ID: ${id}`, error);
        }
    },
    addWorkExperience:async(data)=>{
        try {
            const {jobTitle,companyName,city,state,country,startDate,endDate,salary,userId}=data
            const result=await userRepository.addWorkExperience({
                jobTitle:jobTitle,
                companyName:companyName,
                city:city,
                state:state,
                country:country,
                startDate:startDate,
                endDate:endDate,
                currentSalary:salary,
                userId
            })
            logger.info(`Work experience added successfully for user ID: ${userId}, experience ID: ${result._id}`);
            await userRepository.addJobExperienceToUser(userId,result._id)
            logger.info(`Work experience associated with user ID: ${userId}, experience ID: ${result._id}`);
        } catch (error) {
            logger.error(`Error adding work experience for user ID: ${userId}, error: ${error.message}`);
        }
    },
    getExperiences:async(userId)=>{
        try {
            const workExperiences=await userRepository.getUserWorkExperience(userId)
            logger.info(`Successfully fetched work experiences for user ${userId}`);
            return workExperiences;
        } catch (error) {
            logger.error(`Error fetching work experiences for user ${userId}: ${error.message}`);
        }
    },
    addResumeUrl:async(file,userId)=>{
        try {
            const resumeUrl=await uploadFileToS3(file)
            logger.info(`Resume uploaded successfully for user ${userId}. Resume URL: ${resumeUrl}`);
            await userRepository.addResumeUrl(userId,resumeUrl)
            logger.info(`Resume URL updated in database for user ${userId}`);
            return resumeUrl
        } catch (error) {
            logger.error(`Error updating resume URL in database for user ${userId}: ${error.message}`);
        }
    },
    getResumeUrl:async(userId)=>{
        try {
            const resumeUrl=await userRepository.getResumeUrl(userId)
            if (resumeUrl) {
                logger.info(`Successfully retrieved resume URL for user ${userId}. Resume URL: ${resumeUrl}`);
                return resumeUrl;
            } else {
                logger.warn(`No resume URL found for user ${userId}.`);
            }
        } catch (error) {
            logger.error(`Error retrieving resume URL for user ${userId}: ${error.message}`);
        }

    },
    findOrCreateGoogleUser: async (profile) => {
        try {
          const existingUser = await userRepository.findUserByGoogleId(profile.emails[0].value);
          if (existingUser) {
            return existingUser;
          }
          const newUser = {
            username: profile.displayName,
            email: profile.emails[0].value,
            password: profile.id,
            isVerified: true,
          };
          return await userRepository.createUser(newUser);
        } catch (error) {
          console.log(error);
        }
    },
  findUserById :async (id) => {
    return await userRepository.findUserById(id);
  }
}

export default userUseCase



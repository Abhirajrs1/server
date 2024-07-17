import userRepository from "../../Framework/Repositories/userRepository.js";
import generateOTP from "../../Framework/Services/otpServices.js";
import EmailService from "../../Framework/Services/mailerServices.js";
import { generateJWT } from "../../Framework/Services/jwtServices.js";
import sendEmail from "../../Framework/Services/forgotPasswordMail.js";
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
           const token=await generateJWT(user.email)
           logger.info(`User login successfully ${email}`)
           return {user,token}
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
   findOrCreateGoogleUser : async (profile) => {
    try {
      const existingUser = await userRepository.findUserByGoogleId(profile.id);
      if (existingUser) {
        return existingUser;
      }
  
      const newUser = {
        username: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id,
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



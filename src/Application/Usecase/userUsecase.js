import userRepository from "../../Framework/Repositories/userRepository.js";
import generateOTP from "../../Framework/Services/otpServices.js";
import EmailService from "../../Framework/Services/mailerServices.js";
import { generateJWT } from "../../Framework/Services/jwtServices.js";
import sendEmail from "../../Framework/Services/forgotPasswordMail.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
dotenv.config()

const emailService=new EmailService()

const userUseCase={


    userSignUp:async(userData)=>{
        try {
            const {username,email,password}=userData
            const existingUser=await userRepository.findUserByEmail(email)
                if(existingUser){
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
            return newUser
        } catch (error) {   
            console.log(error);
        }
    },

    verifyOtp: async(email,otp)=>{
        try {
           const user=await userRepository.findTemperoryUserByEmail(email) 
           if(!user){
            return {message:'Temperory user not found'}
           }
           if(user.otpCode==otp && user.otpExpiration>Date.now()){
            await userRepository.moveTemperoryToUser(email)
            return true
           }
        } catch (error) {
            console.log(error);
        }
    },

    resentOtp:async(email)=>{
        try {
            const otp=generateOTP()
            const expiration = new Date(Date.now() + 5 * 60 * 1000); 
            await userRepository.updateUserOtp(email,otp,expiration)
            await emailService.sendOtpEmail(email,otp)
            return true
        } catch (error) {
            console.log(error);
        }
    },
    userlogin:async(userData)=>{
        try {
            const {email,password}=userData
           const user=await userRepository.findUserByEmail(email)
           if(!user){
            return { message:"User not found" }
           }
           const valid=await bcrypt.compare(password,user.password)
           if(!valid){
            return {message:"Incorrect password"}
           }
           const token=await generateJWT(user.email)
           return {user,token}

        } catch (error) {
            console.log(error)  
        }
    },
    forgotPassword:async(email)=>{
        try {
            const user=await userRepository.findUserByEmail(email)
                if(!user){
                    return {message:"User not found"}
                }
                const token = jwt.sign({ id:user._id }, process.env.KEY, { expiresIn: '1h' });
                sendEmail(token,user.email)
                return {message:"Check our email for reset password link"}
        } catch (error) {
            console.log(error);
        }

    },
    resetPassword:async(token,password)=>{
        try {
            const decoded=jwt.verify(token,process.env.KEY)
            const id=decoded.id
            const hashPassword=await bcrypt.hash(password,10)
            const user=await userRepository.findUserByIdAndUpdate(id,hashPassword)
            if(!user){
                return {message:"User not found, so password doesn't change"}
            }else{
                return {message:"Password successfully changed"}
            }
        } catch (error) {
            console.log(error);
        }
    },
    getUserByEmail:async(email)=>{
        const user= await userRepository.findUserByEmail(email)
        if(!user){
            return {message:"User not found"}
        }else{
            return {user}
        }
    },
    updateUser:async(email,updatedUserContact)=>{
        try {
            const user=await userRepository.updateContact(email,updatedUserContact)
            if(!user){
                return {message:"User not found"}
            }else{
                return {message:"User contact details updated successfully",user}
            }
        } catch (error) {
            console.log(error);
        }

    },
    addEducation:async(email,education)=>{
        try {
            const user=await userRepository.addEducation(email,education)
            if(!user){
                return {message:"User not found"}
            }else{
                return {message:"User education added successfully",user}
            }
        } catch (error) {
            console.log(error);
        }
    },
    addSkill:async(email,skill)=>{
        try {
            const user=await userRepository.addSkill(email,skill)
            if(!user){
                return {message:"User not found"}
            }else{
                return {message:"User skill added successfully",user}
            }
        } catch (error) {
            console.log(error);
        }
    }
}

export default userUseCase



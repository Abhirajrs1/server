import recruiterRepository from "../../Framework/Repositories/recruiterRepository.js";
import generateOTP from "../../Framework/Services/otpServices.js";
import EmailService from "../../Framework/Services/mailerServices.js";
import { generateJWT } from "../../Framework/Services/jwtServices.js";
import sendRecruiterEmail from "../../Framework/Services/recruiterForgotPassword.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const emailService=new EmailService()

const recruiterUseCase={

    recruiterSignUp:async(recruiterData)=>{
        try {
            const {recruitername,email,password}=recruiterData
            const existingRecruiter=await recruiterRepository.findRecruiterByEmail(email)
            if(existingRecruiter){
                return {message:"Recruiter already registered"}
            }
            const hashPassword=await bcrypt.hash(password,10)
            const otp=generateOTP()
            const expiration = new Date(Date.now() + 5 * 60 * 1000); 
            const newRecruiter=await recruiterRepository.createRecruiter({
                recruitername:recruitername,
                email:email,
                password:hashPassword,
                otpCode:otp,
                otpExpiration:expiration
            })
            await emailService.sendOtpEmail(email,otp)
            return newRecruiter
        } catch (error) {
            return {message:error.message}
        }
    },



    recruiterVerifyOtp:async(email,otp)=>{
        try {
            const recruiter=await recruiterRepository.findTemperoryRecruiterByEmail(email)
            if(!recruiter){
                return {message:"Temperory recruiter not found"}
            }
            if(recruiter.otpCode==otp&&recruiter.otpExpiration>Date.now()){
                await recruiterRepository.moveTemperoryRecruiterToRecruiter(email)
                return true
            }
        } catch (error) {
            return {messsage:error.message}
        }
    },




    RecruiterResendOtp:async(email)=>{
        try {
            const otp=generateOTP()
            const expiration = new Date(Date.now() + 5 * 60 * 1000); 
            await recruiterRepository.updateRecruiterOtp(email,otp,expiration)
            await emailService.sendOtpEmail(email,otp)
            return true
        } catch (error) {
            return {message:error.message}
        }
    },



    recruiterlogin:async(recruiterData)=>{
        try {
            const {email,password}=recruiterData
           const recruiter=await recruiterRepository.findRecruiterByEmail(email)
           if(!recruiter){
            return { message:"Recruiter not found" }
           }
           const valid=await bcrypt.compare(password,recruiter.password)
           if(!valid){
            return {message:"Incorrect password"}
           }
           const token=await generateJWT(recruiter.email)
           return {recruiter,token}

        } catch (error) {
            return {message:error.message} 
        }
    },



    forgotPassword:async(email)=>{
        try {
            const recruiter=await recruiterRepository.findRecruiterByEmail(email)
                if(!recruiter){
                    return {message:"Recruiter not found"}
                }
                const token = jwt.sign({ id:recruiter._id }, process.env.KEY, { expiresIn: '1h' });
                sendRecruiterEmail(token,recruiter.email)
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
            const recruiter=await recruiterRepository.findRecruiterByIdAndUpdate(id,hashPassword)
            if(!recruiter){
                return {message:"Recruiter not found, so password doesn't change"}
            }else{
                return {message:"Password successfully changed"}
            }
        } catch (error) {
            console.log(error);
        }
    },
    getRecruiterByEmail:async(email)=>{
        const recruiter=await recruiterRepository.findRecruiterByEmail(email)
        if(!recruiter){
            return {message:"Recruiter not found"}
        }else{
            return {recruiter}
        }
    }
}

export default recruiterUseCase
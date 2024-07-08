
import userUseCase from "../../../Application/Usecase/userUsecase.js";
import { generateJWT } from "../../../Framework/Services/jwtServices.js";

const userController = {
   
    postSignup: async (req, res) => {
        try {
            const { username, email, password } = req.body
            const userData = { username, email, password }
            let result = await userUseCase.userSignUp(userData)
            if (result.message) {
                res.status(409).json({ success: false, message: result.message })

            } else {
                res.status(201).json({ success: true, message: "User registered,OTP sent to mail" })

            }
        } catch (error) {
            res.status(500).json({ message: "Internal server error" })
        }
    },

    postVerifyOtp: async (req, res) => {
        const { email, otp } = req.body
        try {
            const isVerified = await userUseCase.verifyOtp(email, otp)
            if (isVerified) {
                res.status(200).json({success:true, message: "OTP verified, user registered successfully" })
            } else {
                res.status(400).json({success:false, message: "Enter valid OTP" })
            }
        } catch (error) {
            res.status(500).json({ message: "Internal server error" })
        }
    },
    postResendOtp: async (req, res) => {
        const { email } = req.body
        try {
            const result = await userUseCase.resentOtp(email);
            if (result) {
                res.status(200).json({success:true, message: 'OTP resent successfully!' });
            } else {
                res.status(400).json({success:false, message: 'Error resending OTP. Please try again.' });
            }
        } catch (error) {
            res.status(500).json({ message: "Internal server error" })
        }
    },

    postLogin: async (req, res) => {
        try {
            const { email, password } = req.body
            const userData = { email, password }
            const loginResult = await userUseCase.userlogin(userData)
            if (loginResult.message) {
                res.status(400).json({ success: false, message: loginResult.message })
            } else {
                const { user, token } = loginResult
               res.cookie('accessToken',String(token), { httpOnly: true, maxAge: 3600000 })
                res.status(200).json({ success: true, message: "User login successfully", user,token })
            }
        } catch (error) {
            res.status(500).json({ message: "Internal server error" })
        }
    },
    postForgotPassword: async (req, res) => {
        try {
            const { email } = req.body
            const result = await userUseCase.forgotPassword(email)
            if (result.message == "User not found") {
                res.status(400).json({ success: false, message: result.message })
            }
            if (result.message == "Check our email for reset password link") {
                res.status(200).json({ success: true, message: result.message })
            }
        } catch (error) {
            res.status(500).json({ message: "Internal server error" })
        }
    },
    postResetPassword: async (req, res) => {
        try {
            const { token } = req.params
            const { password } = req.body
            const result = await userUseCase.resetPassword(token, password)
            if (result.message == "User not found, so password doesn't change") {
                res.status(400).json({ success: false, message: result.message })
            } if (result.message == "Password successfully changed") {
                res.status(200).json({ success: true, message: result.message })
            }
        } catch (error) {
            res.status(500).json({ message: "Internal server error" })
        }
    },
    isVerified:async(req,res)=>{
        res.status(200).json({success:true,message:"Verified user",user:req.user})
    },

    postLogout:async(req,res)=>{
        try {
            res.clearCookie('accessToken')
            res.status(200).json({success:true,message:"User logout successfully"})
        } catch (error) {
            res.status(500).json({ message: "Internal server error" })
        }
    },
    getUser:async(req,res)=>{
        try {
            const {email}=req.params
            const result=await userUseCase.getUserByEmail(email)
            if(result.message){
                res.status(400).json({success:false,message:result.message})
            }else{
                const {user}=result
                res.status(200).json({success:true,message:"User found successfully",user})
            }
        } catch (error) {
            res.status(500).json({ message: "Internal server error" })
        }
    },
    userUpdate:async(req,res)=>{
        try {
            const{email}=req.params
            const {updatedUserContact}=req.body
            const updatedUser=await userUseCase.updateUser(email,updatedUserContact)
            if(updatedUser.message=="User not found"){
                res.status(400).json({ success: false, message: updatedUser.message })
            }
            if(updatedUser.message=="User contact details updated successfully"){
                res.status(200).json({success:true,message:updatedUser.message,user:updatedUser.user})
            }
        } catch (error) {
            res.status(500).json({ message: "Internal server error" })
        }
    },
    addEducation:async(req,res)=>{
        try {
            const {email}=req.params
            const {education}=req.body
            
            const insertEducation=await userUseCase.addEducation(email,education)
            if(insertEducation.message=="User not found"){
                res.status(400).json({success:false,message:insertEducation.message})
            }
            if(insertEducation.message=="User education added successfully"){
                res.status(200).json({success:true,message:insertEducation.message,user:insertEducation.user})
            }
        } catch (error) {
            res.status(500).json({ message: "Internal server error" })
        }
    },
    addSkill:async(req,res)=>{
        try {
            const {email}=req.params
            const {skill}=req.body
            const insertSkill=await userUseCase.addSkill(email,skill)
            if(insertSkill.message=="User not found"){
                res.status(400).json({success:false,message:insertSkill.message})
            }
            if(insertSkill.message=="User skill added successfully"){
                res.status(200).json({success:true,message:insertSkill.message,user:insertSkill.user})
            }
        } catch (error) {
            
        }
    },
    handlePassport:async(req,res)=>{
        if(req.user){
            const token=await generateJWT(req.user.email)
            res.cookie('accessToken', token, { httpOnly: true, maxAge: 3600000 });
            res.status(200).json({ success: true, message: "Google authentication successful", user: req.user, token });
            }else{
            res.status(401).json({ success: false, message: "Google authentication failed" });
        }
    }

}

export default userController;



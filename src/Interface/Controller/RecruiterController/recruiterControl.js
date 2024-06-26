import recruiterUseCase from "../../../Application/Usecase/recruiterUsecase.js";

const recruiterController={

    postRecruiterSignup:async(req,res)=>{
        try {
            const {recruitername,email,password}=req.body
            const recruiterData={recruitername,email,password}
            const result=await recruiterUseCase.recruiterSignUp(recruiterData)
            if(result.message){
                res.status(409).json({success:false,message:result.message})
            }else{
                res.status(201).json({success:true,message:"Recruiter registered,OTP sent to mail"})
            }
        } catch (error) {
            res.status(500).json({message:"Internal server error"})
        }
    },
    postVerifyOtp:async(req,res)=>{
        const{email,otp}=req.body
        try {
            const isVerified=await recruiterUseCase.recruiterVerifyOtp(email,otp)
            if(isVerified){
                res.status(200).json({success:true,message:"OTP verified, recruiter registered successfully"})
            }else{
                res.status(400).json({success:false,message:"Enter valid OTP"})
            }
        } catch (error) {
            res.status(500).json({message:"Internal server error"})
        }
    },
    postResendOtp:async(req,res)=>{
        const {email}=req.body
        try {
            const result = await recruiterUseCase.RecruiterResendOtp(email);
            if (result) {
              res.status(200).json({ success:true,message: 'OTP resent successfully!' });
            } else {
              res.status(400).json({success:false,message: 'Error resending OTP. Please try again.' });
            }
        } catch (error) {
            res.status(500).json({message:"Internal server error"})
        }
    },

    postLogin:async(req,res)=>{
        try {
            const {email,password}=req.body
        const recruiterData={email,password}
        const loginResult=await recruiterUseCase.recruiterlogin(recruiterData)
        if(loginResult.message){
            res.status(400).json({success:false,message:loginResult.message})
        }else{
            const {recruiter,token}=loginResult
            res.cookie('recruiteraccessToken',String(token), { httpOnly: true, maxAge: 3600000 })
             res.status(200).json({success:true,message:"Recruiter login successfully",recruiter,token})
        }
        } catch (error) {
           res.status(500).send({message:"Internal server error"})
        }
    },
    postForgotPassword: async (req, res) => {
        try {
            const { email } = req.body
            const result = await recruiterUseCase.forgotPassword(email)
            if (result.message == "Recruiter not found") {
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
            const result = await recruiterUseCase.resetPassword(token, password)
            if (result.message =="Recruiter not found, so password doesn't change") {
                res.status(400).json({ success: false, message: result.message })
            } if (result.message == "Password successfully changed") {
                res.status(200).json({ success: true, message: result.message })
            }
        } catch (error) {
            res.status(500).json({ message: "Internal server error" })
        }
    },
    recruiterVerified:async(req,res)=>{
        try {
            res.status(200).json({success:true,message:"Recruiter verified"})
        } catch (error) {
            res.status(500).json({ message: "Internal server error" })
        }
    },
    postLogout:async(req,res)=>{
        try {
            res.clearCookie('recruiteraccessToken')
            res.status(200).json({success:true,message:"Recruiter logout successfully"})
        } catch (error) {
            res.status(500).json({ message: "Internal server error" })
        }
    },
}
export default recruiterController
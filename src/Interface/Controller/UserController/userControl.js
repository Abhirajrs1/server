
import userUseCase from "../../../Application/Usecase/userUsecase.js";
import { generateJWT } from "../../../Framework/Services/jwtServices.js";
import logger from "../../../Framework/Utilis/logger.js";

const userController = {

    postSignup: async (req, res) => {
        try {
            const { username, email, password } = req.body
            const userData = { username, email, password }
            let result = await userUseCase.userSignUp(userData)
            if (result.message) {
                logger.warn(`Sign up failed for email: ${email}, reason :${result.message}`)
                res.status(409).json({ success: false, message: result.message })

            } else {
                logger.info(`User registered: ${email}`)
                res.status(201).json({ success: true, message: "User registered,OTP sent to mail" })
            }
        } catch (error) {
            logger.error(`Signup error for email: ${email}, error: ${error.message}`)
            res.status(500).json({ message: "Internal server error" })
        }
    },

    postVerifyOtp: async (req, res) => {
        const { email, otp } = req.body
        try {
            const isVerified = await userUseCase.verifyOtp(email, otp)
            if (isVerified) {
                logger.info(`OTP verified for email: ${email}`)
                res.status(200).json({ success: true, message: "OTP verified, user registered successfully" })
            } else {
                logger.warm(`OTP verification failed for email: ${email}`)
                res.status(400).json({ success: false, message: "Enter valid OTP" })
            }
        } catch (error) {
            logger.error(`OTP verification error for email: ${email}, error: ${error.message}`)
            res.status(500).json({ message: "Internal server error" })
        }
    },
    postResendOtp: async (req, res) => {
        const { email } = req.body
        try {
            const result = await userUseCase.resentOtp(email);
            if (result) {
                logger.info(`OTP resend for email: ${email}`)
                res.status(200).json({ success: true, message: 'OTP resent successfully!' });
            } else {
                logger.warn(`Resend OTP failed for email: ${email}`)
                res.status(400).json({ success: false, message: 'Error resending OTP. Please try again.' });
            }
        } catch (error) {
            logger.error(`Resend OTP error for email: ${email}, error: ${error.message}`)
            res.status(500).json({ message: "Internal server error" })
        }
    },

    postLogin: async (req, res) => {
        try {
            const { email, password } = req.body
            const userData = { email, password }
            const loginResult = await userUseCase.userlogin(userData)
            if (loginResult.message) {
                logger.warn(`Login failed for email: ${email}, reason: ${loginResult.message}`)
                res.status(400).json({ success: false, message: loginResult.message })
            } else {
                const { user, token } = loginResult
                res.cookie('accessToken', String(token), { httpOnly: true, maxAge: 3600000 })
                logger.info(`User successfully login : ${email}`)
                res.status(200).json({ success: true, message: "User login successfully", user, token })
            }
        } catch (error) {
            logger.error(`Login error for email: ${email}, error: ${error.message}`)
            res.status(500).json({ message: "Internal server error" })
        }
    },
    postForgotPassword: async (req, res) => {
        try {
            const { email } = req.body
            const result = await userUseCase.forgotPassword(email)
            if (result.message == "User not found") {
                logger.warn(`Forgot password failed for email: ${email}, reason: ${result.message}`)
                res.status(400).json({ success: false, message: result.message })
            }
            if (result.message == "Check our email for reset password link") {
                logger.info(`Password reset email sent to: ${email}`)
                res.status(200).json({ success: true, message: result.message })
            }
        } catch (error) {
            logger.error(`Forgot password error for email: ${email}, error: ${error.message}`)
            res.status(500).json({ message: "Internal server error" })
        }
    },
    postResetPassword: async (req, res) => {
        try {
            const { token } = req.params
            const { password } = req.body
            const result = await userUseCase.resetPassword(token, password)
            if (result.message == "User not found, so password doesn't change") {
                logger.warn(`Reset password failed, user not found for token: ${token}`)
                res.status(400).json({ success: false, message: result.message })
            } if (result.message == "Password successfully changed") {
                logger.info(`Password successfully changed for token: ${token}`)
                res.status(200).json({ success: true, message: result.message })
            }
        } catch (error) {
            logger.error(`Reset password error for token: ${token}, error: ${error.message}`)
            res.status(500).json({ message: "Internal server error" })
        }
    },
    isVerified: async (req, res) => {
        try {
            logger.info(`User verified: ${req.user.email}`)
            res.status(200).json({ success: true, message: "Verified user", user: req.user }) 
        } catch (error) {
            logger.error(`Verification error: ${error.message}`)
            res.status(500).json({ message: "Internal server error"})
        }
    },

    postLogout: async (req, res) => {
        try {
            res.clearCookie('accessToken')
            logger.info(`User successfully logout: ${req.user.email}`)
            res.status(200).json({ success: true, message: "User logout successfully" })
        } catch (error) {
            logger.error(`Logout error: ${error.message}`)
            res.status(500).json({ message: "Internal server error" })
        }
    },
    getUser: async (req, res) => {
        try {
            const { email } = req.params
            const result = await userUseCase.getUserByEmail(email)
            if (result.message) {
                res.status(400).json({ success: false, message: result.message })
            } else {
                const { user } = result
                res.status(200).json({ success: true, message: "User found successfully", user })
            }
        } catch (error) {
            res.status(500).json({ message: "Internal server error" })
        }
    },
    userUpdate: async (req, res) => {
        try {
            const { email } = req.params
            const { updatedUserContact } = req.body
            const updatedUser = await userUseCase.updateUser(email, updatedUserContact)
            if (updatedUser.message == "User not found") {
                res.status(400).json({ success: false, message: updatedUser.message })
            }
            if (updatedUser.message == "User contact details updated successfully") {
                res.status(200).json({ success: true, message: updatedUser.message, user: updatedUser.user })
            }
        } catch (error) {
            res.status(500).json({ message: "Internal server error" })
        }
    },
    addEducation: async (req, res) => {
        try {
            const { email } = req.params
            const { education } = req.body

            const insertEducation = await userUseCase.addEducation(email, education)
            if (insertEducation.message == "User not found") {
                res.status(400).json({ success: false, message: insertEducation.message })
            }
            if (insertEducation.message == "User education added successfully") {
                res.status(200).json({ success: true, message: insertEducation.message, user: insertEducation.user })
            }
        } catch (error) {
            res.status(500).json({ message: "Internal server error" })
        }
    },
    addSkill: async (req, res) => {
        try {
            const { email } = req.params
            const { skill } = req.body
            const insertSkill = await userUseCase.addSkill(email, skill)
            if (insertSkill.message == "User not found") {
                res.status(400).json({ success: false, message: insertSkill.message })
            }
            if (insertSkill.message == "User skill added successfully") {
                res.status(200).json({ success: true, message: insertSkill.message, user: insertSkill.user })
            }
        } catch (error) {

        }
    },
    handlePassport: async (req, res) => {
        if (req.user) {
            const token = await generateJWT(req.user.email)
            res.cookie('accessToken', token, { httpOnly: true, maxAge: 3600000 });
            res.redirect('http://localhost:5173')
        } else {
            res.status(401).json({ success: false, message: "Google authentication failed" });
        }
    }

}

export default userController;



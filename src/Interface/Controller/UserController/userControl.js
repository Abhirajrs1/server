
import userUseCase from "../../../Application/Usecase/userUsecase.js";
import { generateJWT } from "../../../Framework/Services/jwtServices.js";
import logger from "../../../Framework/Utilis/logger.js";

const userController = {

    // create new user
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

    // Otp verification
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

    // Resend otp
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

    // User login
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

    // Forgot password
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

    // Reset password
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

    // User verification
    isVerified: async (req, res) => {
        try {
            logger.info(`User verified: ${req.user.email}`)
            res.status(200).json({ success: true, message: "Verified user", user: req.user })
        } catch (error) {
            logger.error(`Verification error: ${error.message}`)
            res.status(500).json({ message: "Internal server error" })
        }
    },

    // Get all users
    getUser: async (req, res) => {
        try {
            const { email } = req.params
            const result = await userUseCase.getUserByEmail(email)
            if (result.message) {
                logger.warn(`User not found for email: ${email}`)
                res.status(400).json({ success: false, message: result.message })
            } else {
                const { user } = result
                logger.info(`User found: ${email}`)
                res.status(200).json({ success: true, message: "User found successfully", user })
            }
        } catch (error) {
            logger.error(`Get user error for email: ${email} error: ${error.message}`)
            res.status(500).json({ message: "Internal server error" })
        }
    },

    // Update user details
    userUpdate: async (req, res) => {
        try {
            const { email } = req.params
            const { updatedUserContact } = req.body
            const updatedUser = await userUseCase.updateUser(email, updatedUserContact)
            if (updatedUser.message == "User not found") {
                logger.warn(`Update user failed for email: ${email}, reason: ${updatedUser.message}`)
                res.status(400).json({ success: false, message: updatedUser.message })
            }
            if (updatedUser.message == "User contact details updated successfully") {
                logger.info(`User details update successfully: ${email}`)
                res.status(200).json({ success: true, message: updatedUser.message, user: updatedUser.user })
            }
        } catch (error) {
            logger.error(`Update user error for email: ${email}, error:${error.message}`)
            res.status(500).json({ message: "Internal server error" })
        }
    },

    // Add user education
    addEducation: async (req, res) => {
        try {
            const { email } = req.params
            const { education } = req.body

            const insertEducation = await userUseCase.addEducation(email, education)
            if (insertEducation.message == "User not found") {
                logger.warn(`Add education failed for email: ${email}, reason:{insertEducation.message}`)
                res.status(400).json({ success: false, message: insertEducation.message })
            }
            if (insertEducation.message == "User education added successfully") {
                logger.info(`Education details successfully added: ${email}`)
                res.status(200).json({ success: true, message: insertEducation.message, user: insertEducation.user })
            }
        } catch (error) {
            logger.error(`Add education failed for email: ${email}, error: {error.message}`)
            res.status(500).json({ message: "Internal server error" })
        }
    },

    // Add user skills
    addSkill: async (req, res) => {
        try {
            const { email } = req.params
            const { skill } = req.body
            const insertSkill = await userUseCase.addSkill(email, skill)
            if (insertSkill.message == "User not found") {
                logger.warn(`Add skill failed for email: ${email}, reason: ${insertSkill.message}`)
                res.status(400).json({ success: false, message: insertSkill.message })
            }
            if (insertSkill.message == "User skill added successfully") {
                logger.info(`Skill details successfully added: ${email}`)
                res.status(200).json({ success: true, message: insertSkill.message, user: insertSkill.user })
            }
        } catch (error) {
            logger.error(`Add skill failed for email: ${email}, error: {error.message}`)
            res.status(500).json({ message: "Internal server error" })
        }
    },

    // Google authentication
    handlePassport: async (req, res) => {
        if (req.user) {
            const token = await generateJWT(req.user.email)
            res.cookie('accessToken', token, { httpOnly: true, maxAge: 3600000 });
            res.redirect('http://localhost:5173')
        } else {
            res.status(401).json({ success: false, message: "Google authentication failed" });
        }
    },

    // User logout
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

}

export default userController;



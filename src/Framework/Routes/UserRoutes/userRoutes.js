import express from 'express'
import userController from '../../../Interface/Controller/UserController/userControl.js'
import jobController from '../../../Interface/Controller/RecruiterController/jobController.js'
import middleware from '../../../Interface/Middleware/authMiddleware.js'
const router= express.Router()
const authMiddleware=middleware.authMiddleware

import passport from 'passport'

router.post('/employee-signup',userController.postSignup)
router.post('/employee-verifyOtp',userController.postVerifyOtp)
router.post('/employee-resentOtp',userController.postResendOtp)
router.post('/employee-login',userController.postLogin)
router.post('/employee-forgotPassword',userController.postForgotPassword)
router.post('/employee-resetPassword/:token',userController.postResetPassword)
router.get('/verify',authMiddleware,userController.isVerified)
router.get('/employee-details/:email',userController.getUser)
router.put('/employee-updateContact/:email',userController.userUpdate)
router.post('/employee-addQualification/education/:email',userController.addEducation)
router.post('/employee-addQualification/skill/:email',userController.addSkill)
router.get('/employee-logout',authMiddleware,userController.postLogout)

router.get('/employee-listJobs',jobController.getAllJobs)

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      failureRedirect: "http://localhost:3000/employee-login",
    }),
 userController.handlePassport
  );

export {router as UserRouter}
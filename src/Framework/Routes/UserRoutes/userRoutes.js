import express from 'express'
import userController from '../../../Interface/Controller/UserController/userControl.js'
import jobController from '../../../Interface/Controller/RecruiterController/jobController.js'
import jobControl from '../../../Interface/Controller/UserController/jobControl.js'
import resumeControl from '../../../Interface/Controller/UserController/resumeControl.js'
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
router.post('/employee-postResume',authMiddleware,resumeControl.postUserDetails)
router.post('/employee-addresumeeducation',authMiddleware,resumeControl.postResumeEducation)
router.get('/employee-getresumeeducation',authMiddleware,resumeControl.getResumeEducation)
router.post('/employee-addresumeskill',authMiddleware,resumeControl.postResumeSkill)
router.get('/employee-getresumeskill',authMiddleware,resumeControl.getResumeSkill)

router.get('/employee-logout',authMiddleware,userController.postLogout)

router.get('/employee-listJobs',jobController.getAllJobs)
router.get('/employee-getIndividualJobDetails/:id',authMiddleware,jobControl.getIndividualJob)
router.post('/employee-applyJob',authMiddleware,jobControl.applyJob)

router.get('/employee-getCategories',authMiddleware,jobControl.getCategories)

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      failureRedirect: "http://localhost:5173/employee-login",
    }),
 userController.handlePassport
  );

export {router as UserRouter}
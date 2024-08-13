import express from 'express'
import recruiterController from '../../../Interface/Controller/RecruiterController/recruiterControl.js'
import jobController from '../../../Interface/Controller/RecruiterController/jobController.js'
import categoryController from '../../../Interface/Controller/RecruiterController/categoryController.js'
import Middleware from '../../../Interface/Middleware/authMiddleware.js'
import applicationController from '../../../Interface/Controller/RecruiterController/applicationController.js'
import planControl from '../../../Interface/Controller/RecruiterController/planController.js'
const authMiddleware=Middleware.recruiterMiddleware

const router=express.Router()



router.post('/recruiter-signup',recruiterController.postRecruiterSignup)
router.post('/recruiter-verifyOtp',recruiterController.postVerifyOtp)
router.post('/recruiter-resentOtp',recruiterController.postResendOtp)
router.post('/recruiter-login',recruiterController.postLogin)
router.post('/recruiter-forgotPassword',recruiterController.postForgotPassword)
router.post('/recruiter-resetPassword/:token',recruiterController.postResetPassword)
router.get('/recruiter-verify',authMiddleware,recruiterController.recruiterVerified)
router.get('/recruiter-logout',authMiddleware,recruiterController.postLogout)
router.get('/recruiter-getRecruiterDetails/:email',authMiddleware,recruiterController.getRecruiterDetails)

router.post('/recruiter-postJob',authMiddleware,jobController.postJob)
router.get('/recruiter-showJobs/:id',authMiddleware,jobController.showJobs)
router.get('/recruiter-viewJob/:id',authMiddleware,jobController.showIndividualJob)
router.delete('/recruiter-deleteJob/:id',authMiddleware,jobController.deleteJob)
router.put('/recruiter-updateJob/:id',authMiddleware,jobController.editJob)

router.get('/recruiter-getAllCategories',authMiddleware,categoryController.getAllCategories)

router.get('/recruiter-getApplication/:id',authMiddleware,applicationController.getApplication)
router.get('/recruiter-getApplicationDetails/:id',authMiddleware,applicationController.getApplicationDetails)

router.get('/recruiter-getPlans',planControl.getPlansForRecruiter)


export {router as RecruiterRouter}

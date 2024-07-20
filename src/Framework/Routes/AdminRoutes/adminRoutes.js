import express from 'express'
import adminController from '../../../Interface/Controller/AdminController/adminController.js'
import recruiterController from '../../../Interface/Controller/AdminController/recruiterController.js'
import userController from '../../../Interface/Controller/AdminController/userController.js'
import Middleware from '../../../Interface/Middleware/authMiddleware.js'
import jobController from '../../../Interface/Controller/AdminController/jobController.js'
const authMiddleware=Middleware.adminMiddleware

const router=express.Router()

router.post('/admin-login',adminController.postLogin)
router.get('/admin-verify',authMiddleware,adminController.adminVerified)
router.get('/admin-logout',authMiddleware,adminController.adminLogout)

router.get('/admin-candidates',authMiddleware,userController.getAllCandidates)
router.put('/admin-candidates/:id/block',authMiddleware,userController.blockOrUnblockUser)

router.get('/admin-recruiters',authMiddleware,recruiterController.getAllRecruiters)
router.put('/admin-recruiters/:id/block',authMiddleware,recruiterController.blockOrUnblockRecruiter)

router.get('/admin-jobs',authMiddleware,jobController.getAllJobs)
router.put('/admin-jobs/:id/list',authMiddleware,jobController.listOrUnlistJobs)
router.get('/admin-jobdetails/:id',authMiddleware,jobController.getIndividualJob)


export {router as AdminRouter}
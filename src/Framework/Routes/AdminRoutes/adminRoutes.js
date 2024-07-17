import express from 'express'
import adminController from '../../../Interface/Controller/AdminController/adminController.js'
import Middleware from '../../../Interface/Middleware/authMiddleware.js'
const authMiddleware=Middleware.adminMiddleware

const router=express.Router()

router.post('/admin-login',adminController.postLogin)
router.get('/admin-verify',authMiddleware,adminController.adminVerified)
router.get('/admin-logout',authMiddleware,adminController.adminLogout)

router.get('/admin-candidates',authMiddleware,adminController.getAllCandidates)
router.get('/admin-recruiters',authMiddleware,adminController.getAllRecruiters)
router.put('/admin-candidates/:id/block',authMiddleware,adminController.blockOrUnblockUser)
router.put('/admin-recruiters/:id/block',authMiddleware,adminController.blockOrUnblockRecruiter)


export {router as AdminRouter}
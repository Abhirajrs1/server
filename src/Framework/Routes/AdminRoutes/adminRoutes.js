import express from 'express'
import adminController from '../../../Interface/Controller/AdminController/adminController.js'
import recruiterController from '../../../Interface/Controller/AdminController/recruiterController.js'
import userController from '../../../Interface/Controller/AdminController/userController.js'
import Middleware from '../../../Interface/Middleware/authMiddleware.js'
import jobController from '../../../Interface/Controller/AdminController/jobController.js'
import categoryController from '../../../Interface/Controller/AdminController/categoryController.js'
import planController from '../../../Interface/Controller/AdminController/planController.js'
import companyControl from '../../../Interface/Controller/AdminController/companyControl.js'
const authMiddleware=Middleware.adminMiddleware

const router=express.Router()

router.post('/admin-login',adminController.postLogin)
router.get('/admin-verify',authMiddleware,adminController.adminVerified)
router.get('/admin-logout',authMiddleware,adminController.adminLogout)
router.get('/admin-getStats',authMiddleware,adminController.getCountstatus)

router.get('/admin-candidates',authMiddleware,userController.getAllCandidates)
router.put('/admin-candidates/:id/block',authMiddleware,userController.blockOrUnblockUser)

router.get('/admin-recruiters',authMiddleware,recruiterController.getAllRecruiters)
router.put('/admin-recruiters/:id/block',authMiddleware,recruiterController.blockOrUnblockRecruiter)

router.get('/admin-jobs',authMiddleware,jobController.getAllJobs)
router.put('/admin-jobs/:id/list',authMiddleware,jobController.listOrUnlistJobs)
router.get('/admin-jobdetails/:id',authMiddleware,jobController.getIndividualJob)

router.post('/admin-addCategory',authMiddleware,categoryController.postAddCategory)
router.get('/admin-categories',authMiddleware,categoryController.getAllCategories)
router.get('/admin-category/:id',authMiddleware,categoryController.getCategory)
router.put('/admin-category/:id',authMiddleware,categoryController.editCategory)

router.post('/admin-addPlans',authMiddleware,planController.addPlans)
router.get('/admin-plans',authMiddleware,planController.getPlans)

router.get('/admin-companies',authMiddleware,companyControl.getCompanies)
router.put('/admin-companies/:id/block',authMiddleware,companyControl.activeOrInactiveCompany)
router.get('/admin-companyDetails/:id',authMiddleware,companyControl.getCompanyDetails)


export {router as AdminRouter}
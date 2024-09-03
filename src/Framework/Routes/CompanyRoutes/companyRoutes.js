import express from 'express'
import companyController from '../../../Interface/Controller/CompanyController/companyController.js'
import Middleware from '../../../Interface/Middleware/authMiddleware.js'
const authMiddleware=Middleware.companyMiddleware
import multer from 'multer'
const upload=multer({ storage: multer.memoryStorage() })


const router=express.Router()

router.post('/company-signup',companyController.postCompanySignup)
router.post('/company-login',companyController.postCompanyLogin)
router.get('/company-verify',authMiddleware,companyController.companyVerify)
router.get('/company-getStats',authMiddleware,companyController.getStats)


router.get('/get-companies',companyController.getCompanies)
router.get('/company-getCompanyReviews',authMiddleware,companyController.getCompanyReviews)

router.put('/company-updateContact/:email',authMiddleware,companyController.updateProfile)
router.put('/company-updateAboutDetails/:email',authMiddleware,companyController.updateAboutDetails)
router.post('/company-uploaDocuments',upload.single('file'),authMiddleware,companyController.uploadCompanyDocuments)

router.get('/company-logout',authMiddleware,companyController.logOut)
export {router as CompanyRouter}
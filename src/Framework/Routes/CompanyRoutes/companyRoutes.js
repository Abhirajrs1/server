import express from 'express'
import companyController from '../../../Interface/Controller/CompanyController/companyController.js'
import Middleware from '../../../Interface/Middleware/authMiddleware.js'
const authMiddleware=Middleware.companyMiddleware


const router=express.Router()

router.post('/company-signup',companyController.postCompanySignup)
router.post('/company-login',companyController.postCompanyLogin)
router.get('/company-verify',authMiddleware,companyController.companyVerify)
router.get('/get-companies',companyController.getCompanies)

router.put('/company-updateContact/:email',authMiddleware,companyController.updateProfile)
router.put('/company-updateAboutDetails/:email',authMiddleware,companyController.updateAboutDetails)

router.get('/company-logout',authMiddleware,companyController.logOut)
export {router as CompanyRouter}
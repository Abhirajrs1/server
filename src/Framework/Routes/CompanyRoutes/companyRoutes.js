import express from 'express'
import companyController from '../../../Interface/Controller/CompanyController/companyController.js'
import Middleware from '../../../Interface/Middleware/authMiddleware.js'
const authMiddleware=Middleware.companyMiddleware


const router=express.Router()

router.post('/company-signup',companyController.postCompanySignup)
router.post('/company-login',companyController.postCompanyLogin)
router.get('/company-verify',authMiddleware,companyController.companyVerify)

export {router as CompanyRouter}
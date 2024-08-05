import express from 'express'
import companyController from '../../../Interface/Controller/CompanyController/companyController.js'


const router=express.Router()

router.post('/company-signup',companyController.postCompanySignup)

export {router as CompanyRouter}
import logger from "../../Framework/Utilis/logger.js";
import bcrypt from 'bcrypt'
import companyRepository from "../../Framework/Repositories/companyRepository.js";
import { generateJWT } from "../../Framework/Services/jwtServices.js";

const companyUseCase={
    companySignup:async(companyData)=>{
        try {
            const{companyName,email,password}=companyData
            const existingCompany=await companyRepository.findExistingCompany(companyName,email)
            if (existingCompany) {
                if (existingCompany.companyName.toLowerCase() === companyName.toLowerCase()) {
                    logger.warn(`Signup failed: Company with name ${companyName} already exists`);
                    return { message: "Company name already exists" };
                }
                if (existingCompany.email.toLowerCase() === email.toLowerCase()) {
                    logger.warn(`Signup failed: Company with email ${email} already exists`);
                    return { message: "Email already in use" };
                }
            }
            const hashPassword=await bcrypt.hash(password,10)
            const newCompany=await companyRepository.createNewCompany({
                companyName:companyName,
                email:email,
                password:hashPassword
            })
            logger.info(`Signup successful for company: ${newCompany.companyName}`);
            return newCompany
        } catch (error) {
            logger.error('Error during company signup:', error);
        }
    },
    companyLogin:async(companyData)=>{
        try {
           const {email,password}=companyData 
           const company=await companyRepository.findCompanyByEmail(email)
           if(!company){
            logger.warn(`Login failed: Company not found for email ${email}`);
            return {message:"Company not found"}
           }
           const valid=await bcrypt.compare(password,company.password)
            if(!valid){
                logger.warn(`Login failed: Incorrect password for company with email ${email}`);
                return {message:"Incorrect password"}
           }
           const token=await generateJWT(company.email)
           logger.info(`Login successful for company: ${company.email}`);
           return {company,token}
        } catch (error) {
            logger.error(`Error during company login: ${error.message}`);
        }
    },
    getCompanyByEmail:async(email)=>{
        try {
            const company=await companyRepository.findCompanyByEmail(email)
            if (company) {
                logger.info(`Company found with email: ${email}`);
            } else {
                logger.info(`No company found with email: ${email}`);
            }
            return company;
        } catch (error) {
            logger.error(`Error finding company by email: ${error.message}`);
        }
    },
    getAllCompanies:async()=>{
        try {
            const companies=await companyRepository.getAllCompanies()
            logger.info(`Fetched ${companies.length} companies`);
            return companies;
        } catch (error) {
            logger.error(`Error fetching all companies: ${error.message}`);
        }
    },
    updateProfile:async(email,updatedCompanyContact)=>{
        try {
            const result=await companyRepository.updateProfile(email,updatedCompanyContact)
            if(!result){
                logger.warn(`Update company details failed for email: ${email}, reason: Company not found`);
                return {message:"Company not found"}
            }else{
                logger.info(`Company details updated successfully for email: ${email}`);
                return {message:"Company contact details updated successfully",result}
            }
        } catch (error) {
            logger.error(`Update company error for email: ${email}, error: ${error.message}`);
        }
    }

}
export default companyUseCase
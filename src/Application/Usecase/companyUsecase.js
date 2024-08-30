import logger from "../../Framework/Utilis/logger.js";
import bcrypt from 'bcrypt'
import companyRepository from "../../Framework/Repositories/companyRepository.js";
import { generateJWT } from "../../Framework/Services/jwtServices.js";
import uploadFileToS3 from "../../Framework/Services/s3.js";

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
    },
    updateAboutDetails:async(email,formData)=>{
        try {
            const result=await companyRepository.updateAboutDetails(email,formData)
            if(!result){
                logger.warn(`Update company about failed for email: ${email}, reason: Company not found`);
                return {message:"Company not found"}
            }else{
                logger.info(`Company about details updated successfully for email: ${email}`);
                return {message:"Company about details updated successfully",result}
            }
        } catch (error) {
            logger.error(`Update about error for email: ${email}, error: ${error.message}`);
        }
    },
    uploadCompanyDocuments:async(companyId,docType,file)=>{
        try {
            const fileUrl = await uploadFileToS3(file);
            const result = await companyRepository.uploadCompanyDocuments(companyId, docType, fileUrl);
            if (!result) {
                logger.warn(`Upload document failed for company ID: ${companyId}, reason: Company not found`);
                return { message: "Company not found" };
            } else {
                logger.info(`Document ${docType} uploaded successfully for company ID: ${companyId}`);
                return { message: "Document uploaded successfully", result };
            }
        } catch (error) {
            logger.error(`Error uploading document for company ID: ${companyId}, error: ${error.message}`);
        }
    },
    getCompanyDetails:async(id)=>{
        try {
            const company=await companyRepository.findCompanyByid(id)
            if (company) {
                logger.info(`Company details retrieved for ID: ${id}`);
                return company;
              } else {
                logger.warn(`No company found with ID: ${id}`);
                return { message: "Company not found" };
              }
        } catch (error) {
            logger.error(`Error retrieving company details for ID: ${id}, error: ${error.message}`);
        }
    },
    getCompanyReviews:async(id)=>{
        try {
            const reviews=await companyRepository.getCompanyReviews(id)
            if (reviews) {
                logger.info(`Fetched reviews for company ID: ${id}`);
                return reviews;
            } else {
                logger.warn(`No reviews found for company ID: ${id}`);
                return { message: 'No reviews found' };
            }
        } catch (error) {
            logger.error(`Error fetching reviews for company ID: ${id}, error: ${error.message}`);
        }
    }

}
export default companyUseCase
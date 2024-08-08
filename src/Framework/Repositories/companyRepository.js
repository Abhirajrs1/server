import { Company } from "../../Core/Entities/companyCollection.js";
import logger from "../Utilis/logger.js";

const companyRepository={

    findExistingCompany:async(companyName,email)=>{
        try {
            const existingCompany = await Company.findOne({
                $or: [
                    { companyName: { $regex: new RegExp(`^${companyName}$`, 'i') } },
                    { email: { $regex: new RegExp(`^${email}$`, 'i') } }
                ]
            });
            if(existingCompany){
                if (existingCompany.companyName.toLowerCase() === companyName.toLowerCase()) {
                    logger.info(`Company found with name: ${existingCompany.companyName}`);
                }
                if (existingCompany.email.toLowerCase() === email.toLowerCase()) {
                    logger.info(`Company found with email: ${existingCompany.email}`);
                }         
               }else{
                logger.info(`No company found with name: ${companyName}`);
               }
            return existingCompany
        } catch (error) {
            logger.error('Error finding company:', error);
        }
    },
    createNewCompany:async(companyData)=>{
        try {
            const newCompany=new Company(companyData)
            await newCompany.save()
            logger.info(`Company created successfully: ${newCompany.companyName}`);
            return newCompany
        } catch (error) {
            logger.error('Error creating new company:', error);
        }
    },
    findCompanyByEmail:async(email)=>{
        try {
            const company=await Company.findOne({email:email})
            if (company) {
                logger.info(`Company found with email: ${email}`);
              } else {
                logger.info(`No company found with email: ${email}`);
              }
            return company
        } catch (error) {
            logger.error(`Error finding company by email: ${error.message}`);
        }
    },
    getAllCompanies:async()=>{
        try {
            const companies=await Company.find({},'companyName')
            logger.info(`Fetched ${companies.length} companies`);
            return companies.map(company=>company.companyName)
        } catch (error) {
            logger.error(`Error fetching company names: ${error.message}`);
        }
    }

}

export default companyRepository
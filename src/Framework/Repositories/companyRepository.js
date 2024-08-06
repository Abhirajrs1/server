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
    }

}

export default companyRepository
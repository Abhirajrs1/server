import { Company } from "../../Core/Entities/companyCollection.js";
import logger from "../Utilis/logger.js";

const companyRepository={

    findExistingCompany:async(companyName)=>{
        try {
            const existingCompany=await Company.findOne({companyName:{ $regex: new RegExp(`^${companyName}$`, 'i')}})
            if(existingCompany){
                logger.info(`Company found: ${existingCompany.companyName}`);
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
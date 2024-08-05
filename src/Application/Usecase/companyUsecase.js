import logger from "../../Framework/Utilis/logger.js";
import bcrypt from 'bcrypt'
import companyRepository from "../../Framework/Repositories/companyRepository.js";

const companyUseCase={
    companySignup:async(companyData)=>{
        try {
            const{companyName,email,password}=companyData
            const existingCompany=await companyRepository.findExistingCompany(companyName)
            if(existingCompany){
                logger.warn(`Signup failed: Company with name ${companyName} already exists`);
                return {message:"Company already exists"}
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
    }

}
export default companyUseCase
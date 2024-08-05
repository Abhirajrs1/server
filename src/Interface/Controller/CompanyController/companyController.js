import logger from "../../../Framework/Utilis/logger.js";
import companyUseCase from "../../../Application/Usecase/companyUsecase.js";

const companyController={
    postCompanySignup:async(req,res)=>{
        try {
            const formData=req.body
            const {companyName,email,password}=formData
            const companyData={companyName,email,password}
            const result =await companyUseCase.companySignup(companyData)
            if(result.message){
                logger.warn('Company signup failed: Company already exists', { companyName });
                return res.status(409).json({success:false,message:result.message})
            }else{
                logger.info('Company registered successfully', { companyName });
                return res.status(201).json({ success: true, message: "Company registered successfully" });
            }
        } catch (error) {
            logger.error(`Error in postCompanySignup controller, ${error.message}`);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

}
export default companyController
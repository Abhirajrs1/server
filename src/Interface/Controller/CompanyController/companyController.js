import logger from "../../../Framework/Utilis/logger.js";
import companyUseCase from "../../../Application/Usecase/companyUsecase.js";

const companyController={
    postCompanySignup:async(req,res)=>{
        try {
            const formData=req.body
            const {companyName,email,password}=formData
            const companyData={companyName,email,password}
            const result =await companyUseCase.companySignup(companyData)
            if(result.message ==="Company name already exists"){
                logger.warn(`Company signup failed: ${result.message}`);
                return res.json({success:false,message:result.message})
            }else if(result.message === "Email already in use"){
                logger.warn(`Company signup failed: ${result.message}`);
                return res.json({success:false,message:result.message})
            }else{
                logger.info('Company registered successfully', { companyName });
                return res.status(201).json({ success: true, message: "Company registered successfully" });
            }
        } catch (error) {
            logger.error(`Error in postCompanySignup controller, ${error.message}`);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },
    postCompanyLogin:async(req,res)=>{
        try {
            const {email,password}=req.body
            const companyData={email,password}
            const loginResult=await companyUseCase.companyLogin(companyData)
            if(loginResult.message){
                logger.warn(`Company login failed: ${loginResult.message}`);
                return res.status(400).json({ success: false, message: loginResult.message });
            }
            const { company, token } = loginResult; 
            res.cookie('companyaccessToken', String(token), { httpOnly: true, maxAge: 3600000 });
            logger.info(`Company successfully logged in: ${email}`);
            res.status(200).json({ success: true, message: "User login successfully",company, token });
        } catch (error) {
            logger.error(`Error in postCompanyLogin controller, ${error.message}`);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },
    companyVerify:async(req,res)=>{
        try {
           logger.info(`Company verified: ${req.company.email}`);           
           res.status(200).json({ success: true, message: "Company verified",company:req.company})
        } catch (error) {
            logger.error(`Error in company Verified: ${error.message}`);
            res.status(500).json({ message: "Internal server error" })
        }
    },
    getCompanies:async(req,res)=>{
        try {
            const companies=await companyUseCase.getAllCompanies()
            logger.info('Successfully fetched company names');
            return res.status(200).json({ success: true, companyNames:companies });
        } catch (error) {
            logger.error(`Error in getCompanies controller: ${error.message}`);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },
    logOut:async(req,res)=>{
        try {
            res.clearCookie('companyaccessToken');
            logger.info(`Company successfully logged out}`);
            res.status(200).json({ success: true, message: "Company logout successfully" });
        } catch (error) {
            logger.error(`Logout error: ${error.message}`);
            res.status(500).json({ message: "Internal server error" });
        }
    },
    updateProfile:async(req,res)=>{
        try {
           const {updatedCompanyContact}=req.body
           const {email}=req.params
           const updateCompany=await companyUseCase.updateProfile(email,updatedCompanyContact)
           if (updateCompany.message === "Company not found") {
            logger.warn(`Update company failed for email: ${email}, reason: ${updateCompany.message}`);
            res.status(400).json({ success: false, message: updateCompany.message });
        } else if (updateCompany.message === "Company contact details updated successfully") {
            logger.info(`Company contact details updated successfully: ${email}`);
            res.status(200).json({ success: true, message: updateCompany.message, company: updateCompany.result});
        } else {
            logger.warn(`Update user failed for email: ${email}, reason: ${updateCompany.message}`);
            res.status(400).json({ success: false, message: updateCompany.message });
        }
        } catch (error) {
            logger.error(`Update company error for email: ${email}, error: ${error.message}`);
            res.status(500).json({ message: "Internal server error" });
        }
    },
    updateAboutDetails:async(req,res)=>{
        try {
            const {updatedCompanyAbout}=req.body
            const{email}=req.params
            console.log(updatedCompanyAbout,"DATA");
            const updateAboutDetails=await companyUseCase.updateAboutDetails(email,updatedCompanyAbout)
            if(updateAboutDetails.message==="Company not found"){
                logger.warn(`Update company about failed for email: ${email}, reason: ${updateAboutDetails.message}`);
                res.status(400).json({ success: false, message: updateAboutDetails.message }); 
            }else if(updateAboutDetails.message==='Company about details updated successfully'){
                logger.info(`Company about details updated successfully: ${email}`);
                res.status(200).json({ success: true, message: updateAboutDetails.message, company: updateAboutDetails.result});
            }else{
                logger.warn(`Update user about failed for email: ${email}, reason: ${updateAboutDetails.message}`);
                res.status(400).json({ success: false, message: updateAboutDetails.message });
            }
        } catch (error) {
            logger.error(`Update company about error for email: ${email}, error: ${error.message}`);
            res.status(500).json({ message: "Internal server error" });
        }
    }

}
export default companyController
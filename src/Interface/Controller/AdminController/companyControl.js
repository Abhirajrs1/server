import logger from "../../../Framework/Utilis/logger.js";
import adminUseCase from "../../../Application/Usecase/adminUsecase.js";

const companyControl={

    getCompanies:async(req,res)=>{
        try {
            const page=parseInt(req.query.page) || 1
            const limit=parseInt(req.query.limit) || 5
            const companies=await adminUseCase.getAllCompanies(page,limit)
            logger.info(`Retrieved all companies, count: ${companies.length}`);
            res.status(200).json({success:true,companies:companies.companies,total:companies.total,page:companies.page,limit:companies.limit}) 
        } catch (error) {
            logger.error(`Error in getAllCompanies: ${error.message}`);
            res.status(500).json({ message: "Internal server error" })  
        }
    },
    activeOrInactiveCompany:async(req,res)=>{
        try {
            const {id}=req.params
            const result=await adminUseCase.activeOrInactiveCompany(id)
            if(result.message){
                return res.status(400).json({ success: false, message: result.message });  
            }
             return res.status(200).json({ success: true, block: result.block });
        } catch (error) {
            logger.error(`Error active/inactive company: ${error.message}`);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}
export default companyControl
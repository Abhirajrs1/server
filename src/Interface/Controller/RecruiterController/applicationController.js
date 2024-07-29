import logger from "../../../Framework/Utilis/logger.js";
import applicationUseCase from "../../../Application/Usecase/applicationUsecase.js";

const applicationController={
    getApplication:async(req,res)=>{
        try {
            const {id}=req.params
            const application=await applicationUseCase.getApplicationByRecruiter(id)
            if(application.message){
                logger.warn(`Failed to fetch applications for recruiter ID: ${id} - ${application.message}`);
                return res.status(400).json({success:false,message:application.message})
            }else{
                logger.info(`Applications fetched successfully for recruiter ID: ${id}`);
                return res.status(200).json({success:true,message:"Job fetch successfully",application})
            }
        } catch (error) {
            logger.error(`Error fetching applications for recruiter ID: ${id} - ${error.message}`);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    },
    getApplicationDetails:async(req,res)=>{
        try {
            const {id}=req.params
            const application=await applicationUseCase.getApplicationDetails(id)
            if(application.message){
                logger.warn(`Failed to fetch application details for application ID: ${id} - ${application.message}`);
                return res.status(400).json({success:false,message:application.message})
            }else{
                logger.info(`Application details fetched successfully for application ID: ${id}`);
                return res.status(200).json({success:true,message:"Job fetch successfully",application})
            }
        } catch (error) {
            logger.error(`Error fetching application details for application ID: ${id} - ${error.message}`);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    }

}
export default applicationController
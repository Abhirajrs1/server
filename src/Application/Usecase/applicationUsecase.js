import logger from "../../Framework/Utilis/logger.js";
import applicationRepository from "../../Framework/Repositories/applicationRepository.js";

const applicationUseCase={
    getApplicationByRecruiter:async(id)=>{
        try {
            const application=await applicationRepository.getApplicationByRecruiter(id)
            if(!application){
                logger.warn(`Recruiter ID: ${id}`);
                return {message:"Application not found"}
            }else{
                logger.info(`Applications fetched successfully for recruiter ID: ${id}`);
                return application;
            }
        } catch (error) {
            logger.error(`Error fetching applications for recruiter ID: ${id} - ${error.message}`);
        }
    },
    getApplicationDetails:async(id)=>{
        try {
            const application=await applicationRepository.getApplicationDetails(id)
            if(!application){
                logger.warn(`Application ID: ${id}`);
                return {message:"Application not found"}
            }else{
                logger.info(`Application details fetched successfully for application ID: ${id}`);
                return application;
            }
        } catch (error) {
            logger.error(`Error fetching application details for application ID: ${id} - ${error.message}`);
        }
    }

}
export default applicationUseCase
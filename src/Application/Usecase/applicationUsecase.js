import logger from "../../Framework/Utilis/logger.js";
import applicationRepository from "../../Framework/Repositories/applicationRepository.js";
import jobRepository from "../../Framework/Repositories/jobRepository.js";

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
    },
    checkAlreadyApplied:async(jobId,userId)=>{
        try {
            const existingApplication=await applicationRepository.findAlreadyApply(jobId,userId)
            if(existingApplication){
                logger.info(`User ${userId} has already applied for job with ID: ${jobId}`);
                return {hasApplied:true, message: "You have already applied for this job" };
            }
            logger.info(`User ${userId} has not applied for job with ID: ${jobId}`);
            return { hasApplied: false };
        } catch (error) {
            logger.error(`Error checking if user ${userId} applied for job ${jobId}: ${error.message}`);
            return { error: "Failed to check job application status" };
        }
    },
    getApplicationforCandidates:async(id)=>{
        try {
            const application=await applicationRepository.getApplicationforCandidates(id)
            if(!application){
                logger.warn(`Recruiter ID: ${id}`);
                return {message:"Application not found"}
            }else{
                logger.info(`Applications fetched successfully for candidate ID: ${id}`);
                return application;
            }
        } catch (error) {
            logger.error(`Error fetching applications for candidate ID: ${id} - ${error.message}`);
        }
    }

}
export default applicationUseCase
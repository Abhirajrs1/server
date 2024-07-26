import logger from "../../../Framework/Utilis/logger.js";
import jobUseCase from "../../../Application/Usecase/jobUsecase.js";

const jobControl={
    getIndividualJob:async(req,res)=>{
        try {
            const {id}=req.params
            const job=await jobUseCase.getJobById(id)
            if(job.message){
                logger.warn(`Error fetching job: ${job.message}`)
                return res.status(400).json({success:false,message:job.message})
            }
            logger.info(`Job fetched successfully: ${id}`)
            return res.status(200).json({success:true,message:"Job fetch successfully",job})
        } catch (error) {
            logger.error(`Error in showJobs: ${error.message}`);
            res.status(500).json({ message: "Internal server error" })
        }
    },
    applyJob:async(req,res)=>{
        try {
            const jobId=req.query.jobid
            const recruiterid=req.query.recruiterid
            const jobData={...req.body,applicant:req.user.user._id}
            const application=await jobUseCase.applyJob(jobId,recruiterid,jobData)
            if(application.message){
                logger.warn(`Error in job posting: ${application.message}`)
                return res.status(400).json({success:false,message:application.message})
            }
            logger.info(`Job applyed successfully`)
            return res.status(200).json({success:true,message:"Job posted successfully",application})
        } catch (error) {
            logger.error(`Error in apply job: ${error.message}`);
            res.status(500).json({ message: "Internal server error" })
        }
    }

}
export default jobControl
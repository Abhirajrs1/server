
import jobUseCase from "../../../Application/Usecase/jobUsecase.js"
import logger from "../../../Framework/Utilis/logger.js"

const jobController={

    postJob:async(req,res)=>{
        try {
            const jobData={...req.body,jobPostedBy:req.recruiter.recruiter._id}
            const job=await jobUseCase.postJob(jobData)
            if(job.message){
                logger.warn(`Failed to post job: ${job.message}`);
                res.status(400).json({success:false,message:job.message})
            }else{
                logger.info(`Job created successfully`);
                res.status(200).json({success:true,message:"Job created successfully",job:job.newJob})
            }
            
        } catch (error) {
            logger.error(`Error in postJob: ${error.message}`);
            res.status(500).json({ message: "Internal server error" })
        }
    },
    getAllJobs:async(req,res)=>{
        try {
            const jobs=await jobUseCase.getAllJobs()
            logger.info(`Retrieved all jobs, count: ${jobs.length}`);
            res.status(200).json({success:true,jobs:jobs})
        } catch (error) {
            logger.error(`Error in getAllJobs: ${error.message}`);
            res.status(500).json({ message: "Internal server error" })
        }
    },
    showJobs:async(req,res)=>{
        try {
            const {id}=req.params
            const jobs=await jobUseCase.showJobs(id)
            if(jobs.message){
                logger.warn(`Failed to show jobs for recruiter ${id}: ${jobs.message}`);
                res.status(400).json({success:false,message:jobs.message})
            }else{
                logger.info(`Jobs retrieved successfully for recruiter ${id}`);
                res.status(200).json({success:true,message:"Job shows successfully",jobs})
            }
        } catch (error) {
            logger.error(`Error in showJobs: ${error.message}`);
            res.status(500).json({ message: "Internal server error" })
        }
    }

}
export default jobController
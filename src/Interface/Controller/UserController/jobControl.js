import logger from "../../../Framework/Utilis/logger.js";
import jobUseCase from "../../../Application/Usecase/jobUsecase.js";
import categoryUseCase from "../../../Application/Usecase/categoryUsecase.js";

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
            if (jobData.dob) {
                const [day, month, year] = jobData.dob.split('/').map(Number);
                jobData.dob = new Date(year, month - 1, day); 
            }
            const application=await jobUseCase.applyJob(jobId,recruiterid,jobData)
            if(application.message){
                logger.warn(`Error in job posting: ${application.message}`)
                return res.status(400).json({success:false,message:application.message})
            }
            logger.info(`Job applyed successfully`)
            return res.status(200).json({success:true,message:"Job posted successfully",application})
        } catch (error) {
            logger.error(`Error in apply job: ${error}`);
            res.status(500).json({ message: "Internal server error" })
        }
    },
    getCategories:async(req,res)=>{
        try {
            const categories=await categoryUseCase.getAllCategoriesForRecruiter()
            logger.info('Categories retrieved successfully')
            return res.status(200).json({success:true,categories})
        } catch (error) {
            logger.error(`Error in fetching categories: ${error.message}`);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

}
export default jobControl
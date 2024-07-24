import { Job } from "../../Core/Entities/jobCollection.js";
import logger from "../Utilis/logger.js";

const jobRepository = {

    createJob: async (jobDetails) => {
        try {
            const newJob = new Job(jobDetails)
            await newJob.save()
            logger.info(`Created new job: ${newJob._id}`);
            return newJob
        } catch (error) {
            logger.error(`Error creating job: ${error}`);
        }
    },
    getJobs: async () => {
        try {
            const jobs = await Job.find()
            logger.info(`Retrieved ${jobs.length} jobs`);
            return jobs
        } catch (error) {
            logger.error(`Error retrieving jobs: ${error}`);
        }
    },
    getJobDetailsById:async(id)=>{
        try {
            const job=await Job.findById({_id:id})
            logger.info(`Retrieved ${id} job`);
            return job
        } catch (error) {
            logger.error(`Error retrieving job: ${error}`);

        }
    },
    getJobsById: async (id) => {
        try {
            const jobs = await Job.find({ jobPostedBy: id })
            logger.info(`Retrieved jobs posted by user: ${id}`);
            return jobs;
        } catch (error) {
            logger.error(`Error retrieving jobs by ID: ${error}`);
        }
    },
    getJobById:async(id)=>{
        try {
            const job=await Job.findById({_id:id})
            logger.info(`Retrieved job: ${id}`);
            return job
        } catch (error) {
            logger.error(`Error retrieving jobs by ID: ${error}`);
        }
    },
    deleteJobById:async(id)=>{
        try {
            const deleteJob=await Job.findByIdAndDelete({_id:id})
            if(deleteJob){
                logger.info(`Job with ID ${id} deleted successfully.`)
            }else{
                logger.warn(`Job with ID ${id} not found.`);
            }
            return deleteJob
        } catch (error) {
            logger.error(`Error deleting job with ID ${id}: ${error.message}`);
        }
    }

}
export default jobRepository
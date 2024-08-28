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
    },
    editJob:async(id,formData)=>{
        try {
            const updatedJob=await Job.findByIdAndUpdate({_id:id},formData,{new:true})
            if (updatedJob) {
                logger.info(`Successfully updated job with ID: ${id}`, { updatedJob });
                return updatedJob;
              } else {
                logger.warn(`Job with ID: ${id} not found`);
              }
            return updatedJob
        } catch (error) {
            logger.error(`Error updating job with ID: ${id}`, { error });
        }
    },
    reportJob:async(jobId,reportedData)=>{
        try {
            const job=await Job.findById({_id:jobId})
            if(job){
                job.jobReports.push(reportedData);
                job.reportCount += 1;

                if (job.reportCount > 5) {
                    await Job.findByIdAndDelete({_id:jobId});
                    logger.info(`Job removed due to excessive reports: ${jobId}`);
                    return { removed: true };
                }
                await job.save();
                logger.info(`Job reported successfully: ${jobId}`);
                return { removed: false, job };
            }else{
                logger.warn(`Job with ID: ${jobId} not found`);
            }
        } catch (error) {
            logger.error(`Error reporting job: ${error.message}`);
        }
    }


}
export default jobRepository
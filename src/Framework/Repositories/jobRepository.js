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
    getJobsById: async (id) => {
        try {
            const jobs = await Job.find({ jobPostedBy: id })
            logger.info(`Retrieved jobs posted by user: ${id}`);
            return jobs;
        } catch (error) {
            logger.error(`Error retrieving jobs by ID: ${error}`);
        }
    }

}
export default jobRepository
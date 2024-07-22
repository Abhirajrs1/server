
import jobRepository from "../../Framework/Repositories/jobRepository.js";
import logger from "../../Framework/Utilis/logger.js";

const jobUseCase = {
    postJob: async (jobData) => {
        try {
            const { jobTitle, companyName, minPrice, maxPrice, jobLocation, yearsOfExperience, employmentType, description, jobPostedBy,education, skills } = jobData

            const newJob = await jobRepository.createJob({
                jobTitle: jobTitle,
                companyName: companyName,
                minPrice: minPrice,
                maxPrice: maxPrice,
                jobLocation: jobLocation,
                yearsOfExperience: yearsOfExperience,
                employmentType: employmentType,
                description: description,
                skills: skills,
                education:education,
                jobPostedBy
            }
            )
            if (!newJob) {
                logger.warn("Job posting not completed");
                return { message: "Job posted not done" }
            }
            logger.info(`New job posted`)
            return newJob
        } catch (error) {
            logger.error(`Error in postJob: ${error}`);
        }
    },
    getAllJobs: async () => {
        try {
            const jobs = await jobRepository.getJobs()
            const activeJobs=jobs.filter(job=>!job.delete)
            logger.info(`Retrieved ${jobs.length} jobs`);
            return activeJobs
        } catch (error) {
            logger.error(`Error in getAllJobs: ${error}`);
        }
    },
    getJobById:async(id)=>{
        try {
            const job=await jobRepository.getJobDetailsById(id)
            if(!job){
                return ({message:"Job not found"})
            }
            logger.info(`Retrieved ${id} successfully`);
            return job
        } catch (error) {
            logger.error(`Error in getJob: ${error}`);
        }
    },
    showJobs: async (id) => {
        try {
            const jobs = await jobRepository.getJobsById(id)
            if (!jobs) {
                logger.warn(`No jobs found for user ID: ${id}`);
                return { message: "No jobs found" }
            }
            logger.info(`Retrieved jobs for user ID: ${id}`);
            return jobs
        } catch (error) {
            logger.error(`Error in showJobs: ${error}`);
        }
    }
}
export default jobUseCase
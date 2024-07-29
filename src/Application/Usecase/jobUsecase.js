
import jobRepository from "../../Framework/Repositories/jobRepository.js";
import applicationRepository from "../../Framework/Repositories/applicationRepository.js";
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
    },
    deleteJob:async(id)=>{
        try {
            const job=await jobRepository.getJobById(id)
            if(!job){
             logger.warn(`Attempt to delete job failed - Job not found or unauthorized. Job ID: ${id}`);         
             return {message: 'Job not found or unauthorized' };
             }
             let deletedJob=await jobRepository.deleteJobById(id)
             logger.info(`Job deleted successfully. Job ID: ${id}`);
             return deletedJob
        } catch (error) {
            logger.error(`Error deleting job with ID ${id}: ${error.message}`);
        }
    },
    applyJob:async(jobId,recruiterid,jobData)=>{
        try {
            const {name,email,contact,dob,totalExperience,currentCompany,currentSalary,expectedSalary,preferredLocation,city,resume,applicant}=jobData
            console.log(resume,"RESUME");
            const newApplication=await applicationRepository.postApplication({
                name:name,
                email:email,
                contact:contact,
                dob:dob,
                totalExperience:totalExperience,
                currentCompany:currentCompany,
                currentSalary:currentSalary,
                expectedSalary:expectedSalary,
                preferredLocation:preferredLocation,
                city:city,
                resume,
                applicant,
                jobId:jobId,
                employerId:recruiterid
            })
            if (!newApplication) {
                logger.warn("Application posting not completed");
                return { message: "Application posted not done" }
            }
            logger.info(`New job application posted`)
            return newApplication
        } catch (error) {
            logger.error(`Error in postJobApplication: ${error}`);
        }
    }
}
export default jobUseCase
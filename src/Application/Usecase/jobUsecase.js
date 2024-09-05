
import jobRepository from "../../Framework/Repositories/jobRepository.js";
import applicationRepository from "../../Framework/Repositories/applicationRepository.js";
import uploadFileToS3 from "../../Framework/Services/s3.js";
import logger from "../../Framework/Utilis/logger.js";
import { Job } from "../../Core/Entities/jobCollection.js";

const jobUseCase = {
    postJob: async (jobData) => {
        try {
            const { jobTitle, companyName, minPrice, maxPrice, jobLocation, yearsOfExperience, category,employmentType, description, jobPostedBy,education, skills,easyApply,applicationUrl } = jobData
            const companyId=await jobRepository.findCompanyByName(companyName)
            const newJob = await jobRepository.createJob({
                company:companyId,
                jobTitle: jobTitle,
                companyName,
                minPrice: minPrice,
                maxPrice: maxPrice,
                jobLocation: jobLocation,
                yearsOfExperience: yearsOfExperience,
                employmentType: employmentType,
                description: description,
                skills: skills,
                education:education,
                categoryName:category,
                jobPostedBy,
                easyApply,
                applicationUrl
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
    editJob:async(id,formData)=>{
        try {
            const job=await jobRepository.editJob(id,formData)
            if (job) {
                logger.info(`Successfully updated job with ID: ${id}`, { job });
                return {message:"Job updated successfully",job}
              } else {
                logger.warn(`Job with ID: ${id} not found`);
              }
        } catch (error) {
            logger.error(`Error updating job with ID: ${id}`, `${error.message}`);
        }
    },
    applyJob:async(jobId,recruiterid,jobData)=>{

        try {
            const {name,email,contact,dob,totalExperience,currentCompany,currentSalary,expectedSalary,preferredLocation,resume,applicant}=jobData
            const job=await Job.findById({_id:jobId})
            if (!job) {
                logger.warn(`Job not found with ID: ${jobId}`);
                return { message: "Job not found" };
            }
            const newApplication=await applicationRepository.postApplication({
                name,
                email,
                contact,
                dob,
                totalExperience,
                currentCompany,
                currentSalary,
                expectedSalary,
                preferredLocation,
                resume,
                applicant,
                jobId:jobId,
                employerId:recruiterid,
                companyId:job.company
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
    },
    reportJob:async(jobId,userId,reason,description)=>{
        try {

            let job=await jobRepository.getJobById(jobId)
            if(!job){
                logger.warn(`Job with ID: ${jobId} not found`);
                return { message: "Job not found" }
            }
            const hasReported=job.jobReports.some(report=>report.reportedBy.toString()===userId.toString())
            if (hasReported) {
                logger.info(`User with ID: ${userId} has already reported job with ID: ${jobId}`);
                return { message: "You have already reported this job." };
              }
            const reportedData={
                reportedBy:userId,
                reason:reason,
                description:description
            }            
            const result=await jobRepository.reportJob(jobId,reportedData)
            if(!result){
                return { message: "Job reporting failed" };
            }
            logger.info(`Job reported successfully: ${jobId}`);
            return result.job;
        } catch (error) {
            logger.error(`Error reporting job: ${error.message}`);
        }
    },
    addReviewAndRating:async(reviewerName,reviewData)=>{
        try {
            const {rating,comment,company}=reviewData
            const result=await jobRepository.addReviewAndRating({
                reviewerName:reviewerName,
                rating:rating,
                comment:comment,
                company:company
            })
            logger.info('Review added successfully for reviewer: ${reviewerName}')
            await jobRepository.addReviewToCompany(company,result._id)
               logger.info('Review associated with company successfully')
               return result
        } catch (error) {
            logger.error(`Error adding review and rating': ${error.message}`)
        }
      
    }
    
}
export default jobUseCase
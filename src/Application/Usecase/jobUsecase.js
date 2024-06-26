
import jobRepository from "../../Framework/Repositories/jobRepository.js";

const jobUseCase={
    postJob:async(jobData)=>{
        try {
            const{jobTitle, companyName, minPrice, maxPrice, jobLocation, yearsOfExperience, employmentType, description, jobPostedBy, skills }=jobData

            const newJob=await jobRepository.createJob({
                jobTitle:jobTitle,
                companyName:companyName,
                minPrice:minPrice,
                maxPrice:maxPrice,
                jobLocation:jobLocation,
                yearsOfExperience:yearsOfExperience,
                employmentType:employmentType,
                description:description,
                skills:skills,
                jobPostedBy
            }
            )
            if(!newJob){
                return {message:"Job posted not done"}
            }
            return newJob
        } catch (error) {
            console.log(error)
        }
    },
    getAllJobs:async()=>{
        try {
            const jobs=await jobRepository.getJobs()
            return jobs
        } catch (error) {
            console.log(error);
        }
    },
    showJobs:async(id)=>{
        try {
            const jobs=await jobRepository.getJobsById(id)
            if(!jobs){
                return {message:"No jobs found"}
            }
            return jobs
        } catch (error) {
            console.log(error);
        }
    }

}
export default jobUseCase
import { Job } from "../../Core/Entities/jobCollection.js";

const jobRepository={

    createJob:async(jobDetails)=>{
        try {
            const newJob=new Job(jobDetails)
            await newJob.save()
            return newJob
        } catch (error) {
            console.log(error);
        }
    },
    getJobs:async()=>{
        try {
            return await Job.find()
        } catch (error) {
            console.log(error);
        }
    },
    getJobsById:async(id)=>{
        try {
            return await Job.find({jobPostedBy:id})
        } catch (error) {
            console.log(error);
        }
    }

}
export default jobRepository
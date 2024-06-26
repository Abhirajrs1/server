
import jobUseCase from "../../../Application/Usecase/jobUsecase.js"

const jobController={

    postJob:async(req,res)=>{
        try {
            const jobData={...req.body,jobPostedBy:req.recruiter.recruiter._id}
            const job=await jobUseCase.postJob(jobData)
            if(job.message){
                res.status(400).json({success:false,message:job.message})
            }else{
                res.status(200).json({success:true,message:"Job created successfully",job:job.newJob})
            }
            
        } catch (error) {
            res.status(500).json({ message: "Internal server error" })
        }
    },
    getAllJobs:async(req,res)=>{
        try {
            const jobs=await jobUseCase.getAllJobs()
            res.status(200).json({success:true,jobs:jobs})
        } catch (error) {
            res.status(500).json({ message: "Internal server error" })
        }
    },
    showJobs:async(req,res)=>{
        try {
            const {id}=req.params
            const jobs=await jobUseCase.showJobs(id)
            if(jobs.message){
                res.status(400).json({success:false,message:jobs.message})
            }else{
                res.status(200).json({success:true,message:"Job shows successfully",jobs})
            }
        } catch (error) {
            res.status(500).json({ message: "Internal server error" })
        }
    }

}
export default jobController
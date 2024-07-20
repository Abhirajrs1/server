import { Admin } from "../../Core/Entities/adminCollection.js";
import { User } from "../../Core/Entities/userCollection.js";
import { Recruiter } from "../../Core/Entities/recruiterCollection.js";
import { Job } from "../../Core/Entities/jobCollection.js";
import logger from "../Utilis/logger.js";

const adminRepository={
   findAdminByEmail:async(email)=>{
     try {
        const admin=await Admin.findOne({email:email})
        if (admin) {
         logger.info(`Admin found: ${email}`);
       } else {
         logger.warn(`Admin not found: ${email}`);
       }
       return admin
     } catch (error) {
      logger.error(`Error finding admin by email: ${email}, ${error.message}`);     }
   },
   findAllCandidates:async(page,limit)=>{
      try {
         const skip=(page-1)*limit
         const candidates=await User.find().skip(skip).limit(limit)
         const total=await User.countDocuments()
         logger.info(`Found ${candidates.length} candidates`);
         return {candidates,total}
      } catch (error) {
         logger.error(`Error fetching all candidates: ${error.message}`);
         
      }
   },
   findAllRecruiters:async(page,limit)=>{
      try {
        const skip=(page-1)*limit
         const recruiters=await Recruiter.find().skip(skip).limit(limit)
         const total=await Recruiter.countDocuments()
         logger.info(`Found ${recruiters.length} recruiters`);
         return {recruiters,total}
      } catch (error) {
         logger.error(`Error fetching all recruiters: ${error.message}`);   
      }
   },
   getAllJobs:async(page,limit)=>{
    try {
      const skip=(page-1)*limit
      const jobs=await Job.find().skip(skip).limit(limit)
      const total=await Job.countDocuments()
      logger.info(`Found ${jobs.length} jobs`);
      return {jobs,total}
    } catch (error) {
      logger.error(`Error fetching all jobs: ${error.message}`);   
    }
   },
   findCandidateById:async(id)=>{
      try {
         const candidate=await User.findById({_id:id})
         if (candidate) {
            logger.info(`Candidate found: ${id}`);
          } else {
            logger.warn(`Candidate not found: ${id}`);
          }
          return candidate
      } catch (error) {
         logger.error(`Error finding candidate by ID: ${id}, ${error.message}`);
      }
   },
   findCandidateByIdAndUpdate: async (id, update) => {
      try {
        const candidate = await User.findByIdAndUpdate(id, { $set: update }, { new: true });
        if (candidate) {
          logger.info(`Candidate updated: ${id}`);
        } else {
          logger.warn(`Candidate not found: ${id}`);
        }
        return candidate;
      } catch (error) {
        logger.error(`Error updating candidate by ID: ${id}, ${error.message}`);
      }
    },
    findRecruiterById:async(id)=>{
      try {
         const recruiter=await Recruiter.findById({_id:id})
         if (recruiter) {
            logger.info(`Recruiter found: ${id}`);
          } else {
            logger.warn(`Recruiter not found: ${id}`);
          }
          return recruiter
      } catch (error) {
         logger.error(`Error finding recruiter by ID: ${id}, ${error.message}`);
      }
   },
   findRecruiterByIdAndUpdate: async (id, update) => {
      try {
        const recruiter = await Recruiter.findByIdAndUpdate(id, { $set: update }, { new: true });
        if (recruiter) {
          logger.info(`Recruiter updated: ${id}`);
        } else {
          logger.warn(`Recruiter not found: ${id}`);
        }
        return recruiter;
      } catch (error) {
        logger.error(`Error updating recruiter by ID: ${id}, ${error.message}`);
      }
    },
    findJobByIdAndUpdate:async(id,update)=>{
      try {
        const job=await Job.findByIdAndUpdate(id,{$set:update},{new:true})
        if(job){
          logger.info(`Job updated: ${id}`)
        }else{
          logger.warn(`Recruiter not found: ${id}`);
        }
        return job
      } catch (error) {
        logger.error(`Error updating job by ID: ${id}, ${error.message}`);
      }
    }  
}
export default adminRepository
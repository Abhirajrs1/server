import { Admin } from "../../Core/Entities/adminCollection.js";
import { User } from "../../Core/Entities/userCollection.js";
import { Recruiter } from "../../Core/Entities/recruiterCollection.js";
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
   findAllCandidates:async()=>{
      try {
         const candidates=await User.find()
         console.log(candidates);
         logger.info(`Found ${candidates.length} candidates`);
         return candidates
      } catch (error) {
         logger.error(`Error fetching all candidates: ${error.message}`);
         
      }
   },
   findAllRecruiters:async()=>{
      try {
         const recruiters=await Recruiter.find()
         logger.info(`Found ${recruiters.length} recruiters`);
         return recruiters
      } catch (error) {
         logger.error(`Error fetching all recruiters: ${error.message}`);   
      }
   }
}
export default adminRepository
import adminRepository from "../../Framework/Repositories/adminRepository.js";
import jobRepository from "../../Framework/Repositories/jobRepository.js";
import companyRepository from "../../Framework/Repositories/companyRepository.js";
import { generateJWT } from "../../Framework/Services/jwtServices.js";
import logger from "../../Framework/Utilis/logger.js";

const adminUseCase = {
  adminLogin: async (adminData) => {
    try {
      const { email, password } = adminData;
      const admin = await adminRepository.findAdminByEmail(email);
      if (!admin) {
        logger.warn(`Admin not found: ${email}`);
        return { message: "Admin not found" };
      }
      if (password != admin.password) {
        logger.warn(`Incorrect password for admin: ${email}`);
        return { message: "Incorrect password" };
      }
      const token = await generateJWT(admin.email);
      logger.info(`Admin login successful: ${email}`);
      return { admin, token };
    } catch (error) {
      logger.error(`Admin login error for ${adminData.email}: ${error.message}`);
      return { message: error.message };
    }
  },
  getAdminByEmail: async (email) => {
    try {
      const admin = await adminRepository.findAdminByEmail(email);
      if (!admin) {
        logger.warn(`Admin not found: ${email}`);
        return { message: "Admin not found" };
      } else {
        logger.info(`Admin found: ${email}`);
        return { admin };
      }
    } catch (error) {
      logger.error(`Error fetching admin by email: ${email}, ${error.message}`);
      return { message: error.message };
    }
  },
  getAllJobs: async (page,limit) => {
    try {
        const {jobs,total} = await adminRepository.getAllJobs(page,limit)
        logger.info(`Retrieved ${jobs.length} jobs`);
        return {jobs,total,page,limit}
    } catch (error) {
        logger.error(`Error in getAllJobs: ${error}`);
    }
},
  getAllCandidates: async (page,limit) => {
    try {
      const {candidates,total} = await adminRepository.findAllCandidates(page,limit);
      if (!candidates) {
        logger.warn(`Candidates not found`);
        return { message: "Candidates not found" };
      } else {
        logger.info(`Found ${candidates.length} candidates`);
        return {candidates,total,page,limit};
      }
    } catch (error) {
      logger.error(`Error fetching all candidates: ${error.message}`);
      return { message: error.message };
    }
  },
  getAllRecruiters: async (page,limit) => {
    try {
      const {recruiters,total} = await adminRepository.findAllRecruiters(page,limit);
      if (!recruiters) {
        logger.warn(`Recruiters not found`);
        return { message: "Recruiters not found" };
      } else {
        logger.info(`Found ${recruiters.length} recruiters`);
        return {recruiters,total,page,limit};
      }
    } catch (error) {
      logger.error(`Error fetching all recruiters: ${error.message}`);
      return { message: error.message };
    }
  },
  getAllCompanies:async(page,limit)=>{
    try {
      const {companies,total}=await adminRepository.findAllCompanies(page,limit)
      if(!companies){
        logger.warn(`Companies not found`);
        return { message: "Companies not found" };
      }else{
        logger.info(`Found ${companies.length} companies`);
        return {companies,total,page,limit};
      }
    } catch (error) {
      logger.error(`Error fetching all companies: ${error.message}`);
      return { message: error.message };
    }
  },
  candidateBlockOrUnblock: async (id) => {
    try {
      const candidate = await adminRepository.findCandidateById(id);
      if (!candidate) {
        logger.warn(`Candidate not found: ${id}`);
        return { message: "Candidate not found" };
      }
      const newBlockStatus = !candidate.block;
      await adminRepository.findCandidateByIdAndUpdate(id, { block: newBlockStatus });
      logger.info(`Candidate ${id} block status updated to ${newBlockStatus}`);
      return { success: true, block: newBlockStatus };
    } catch (error) {
      logger.error(`Error updating block status for candidate ${id}: ${error.message}`);
      return { message: error.message };
    }
  },
  recruiterBlockOrUnblock:async(id)=>{
    try {
      const recruiter = await adminRepository.findRecruiterById(id);
      if (!recruiter) {
        logger.warn(`Recruiter not found: ${id}`);
        return { message: "Recruiter not found" };
      }
      const newBlockStatus = !recruiter.block;
      await adminRepository.findRecruiterByIdAndUpdate(id, { block: newBlockStatus });
      logger.info(`Recruiter ${id} block status updated to ${newBlockStatus}`);
      return { success: true, block: newBlockStatus };
      
    } catch (error) {
      logger.error(`Error updating block status for recruiter ${id}: ${error.message}`);
      return { message: error.message };
    }
  },
  jobListOrUnlist:async(id)=>{
    try {
      const job=await jobRepository.getJobById(id)
      if(!job){
        logger.warn(`Jobs not found ${id}`)
        return { message: "Job not found" };
      }
      const newListStatus=!job.delete
      await adminRepository.findJobByIdAndUpdate(id,{delete:newListStatus})
      return {success:true,delete:newListStatus}
    } catch (error) {
      logger.error(`Error updating list status of job ${id}: ${error.message}`);
      return { message: error.message };
    }
  },
  activeOrInactiveCompany:async(id)=>{
    try {
      const company=await companyRepository.findCompanyByid(id)
      if(!company){
        logger.warn(`Company not found ${id}`)
        return { message: "Company not found" };
      }
      const newActiveStatus=!company.block
      await adminRepository.findCompanyByIdAndUpdate(id,{block:newActiveStatus})
      return {success:true,block:newActiveStatus}
    } catch (error) {
      logger.error(`Error updating active status of company ${id}: ${error.message}`);
      return { message: error.message };
    }
  }
};

export default adminUseCase;

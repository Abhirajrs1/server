import adminRepository from "../../Framework/Repositories/adminRepository.js";
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
  getAllCandidates: async () => {
    try {
      const candidates = await adminRepository.findAllCandidates();
      logger.info(`Found ${candidates.length} candidates`);
      return candidates;
    } catch (error) {
      logger.error(`Error fetching all candidates: ${error.message}`);
      return { message: error.message };
    }
  },
  getAllRecruiters: async () => {
    try {
      const recruiters = await adminRepository.findAllRecruiters();
      logger.info(`Found ${recruiters.length} recruiters`);
      return recruiters;
    } catch (error) {
      logger.error(`Error fetching all recruiters: ${error.message}`);
      return { message: error.message };
    }
  }
};

export default adminUseCase;

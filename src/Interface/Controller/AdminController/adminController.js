import adminUseCase from "../../../Application/Usecase/adminUsecase.js"
import logger from "../../../Framework/Utilis/logger.js"

const adminController = {

  postLogin: async (req, res) => {
    try {
      const { email, password } = req.body
      const adminData = { email, password }
      const loginResult = await adminUseCase.adminLogin(adminData)
      if (loginResult.message) {
        logger.warn(`Admin login failed for ${email}: ${loginResult.message}`);
        res.status(400).json({ success: false, message: loginResult.message })
      } else {
        const { admin, token } = loginResult
        res.cookie('adminaccessToken', String(token), { httpOnly: true, maxAge: 3600000 })
        logger.info(`Admin login successful: ${email}`);
        res.status(200).json({ success: true, message: "Admin login successfully", admin, token })
      }
    } catch (error) {
      logger.error(`Admin login error for ${req.body.email}: ${error.message}`);
      res.status(500).send({ message: "Internal server error" })
    }
  },
  adminVerified: async (req, res) => {
    try {
      logger.info(`Admin verification check`);
      res.status(200).json({ success: true, message: "Admin verified" })
    } catch (error) {
      logger.error(`Admin verification error: ${error.message}`);
      res.status(500).json({ message: "Internal server error" })
    }
  },

  adminLogout: async (req, res) => {
    try {
      res.clearCookie('adminaccessToken');
      logger.info(`Admin successfully logout ${req.admin.admin.email}`);
      res.status(200).json({ success: true, message: "Admin logout successfully" });
    } catch (error) {
      logger.error(`Logout error: ${error.message}`);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getAllCandidates: async (req, res) => {
    try {
      const page=parseInt(req.query.page) || 1
      const limit=parseInt(req.query.limit) || 10
      const candidates = await adminUseCase.getAllCandidates(page,limit)
      if(candidates.message){
        logger.warn(`Error fetching candidatess: ${candidates.message}`)
      }
      logger.info(`Found ${candidates.length} candidates`);
      res.status(200).json({ success: true, candidates:candidates.candidates,total:candidates.total,page:candidates.page,limit:candidates.limit })
    } catch (error) {
      logger.error(`Error fetching candidates: ${error.message}`)
      res.status(500).json({ message: "Internal server error" })
    }
  },
  getAllRecruiters: async (req, res) => {
    try {
      const page=parseInt(req.query.page) || 1
      const limit=parseInt(req.query.limit) || 10
      const recruiters = await adminUseCase.getAllRecruiters(page,limit)
      if(recruiters.message){
        logger.warn(`Error fetching recruiters: ${recruiters.message}`)
      }
      logger.info(`Found ${recruiters.length} candidates`);
      res.status(200).json({ success: true, recruiters:recruiters.recruiters,total:recruiters.total,page:recruiters.page,limit:recruiters.limit })
    } catch (error) {
      logger.error(`Error fetching recruiters: ${error.message}`)
      res.status(500).json({ message: "Internal server error" })
    }
  },
  blockOrUnblockUser: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await adminUseCase.candidateBlockOrUnblock(id);
      if (result.message) {
        return res.status(400).json({ success: false, message: result.message });
      }
      res.status(200).json({ success: true, block: result.block });
    } catch (error) {
      logger.error(`Error blocking/unblocking user: ${error.message}`);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  blockOrUnblockRecruiter:async(req,res)=>{
    try {
      const { id } = req.params;
      const result = await adminUseCase.recruiterBlockOrUnblock(id);
      if (result.message) {
        return res.status(400).json({ success: false, message: result.message });
      }
      res.status(200).json({ success: true, block: result.block });
    } catch (error) {
      logger.error(`Error blocking/unblocking recruiter: ${error.message}`);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default adminController;

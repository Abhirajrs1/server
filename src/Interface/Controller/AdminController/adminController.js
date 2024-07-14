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
                  res.status(200).json({ success: true, message: "Recruiter verified" })
            } catch (error) {
                  logger.error(`Admin verification error: ${error.message}`);
                  res.status(500).json({ message: "Internal server error" })
            }
      },
      adminLogout:async(req,res)=>{
            try {
                  res.clearCookie('adminaccessToken')
                  logger.info(`Admin successfully logout ${req.admin.email}`)
                  res.status(200).json({success:true,message:"Admin logout successfully"})
            } catch (error) {
                  logger.error(`Logout error: ${error.message}`)
                  res.status(500).json({ message: "Internal server error" })
                  
            }
      }
}
export default adminController
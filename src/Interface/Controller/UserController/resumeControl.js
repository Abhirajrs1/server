import userUseCase from "../../../Application/Usecase/userUsecase.js";
import logger from "../../../Framework/Utilis/logger.js";

const resumeControl={
    postUserDetails:async(req,res)=>{
        try {
            const {resumeData}=req.body
            const updateResume=await userUseCase.updateResume(resumeData)
        if(updateResume){
            logger.info(`Successfully updated or created resume for candidate ID: ${resumeData.candidate}`);
           return res.status(200).json({success:true,message:"Update or created userdetails",user:updateResume})
        }else{
            logger.error(`Error occurred in updating or creating resume for candidate ID: ${resumeData.candidate}`);
            return res.status(500).json({succes:false,message:"Error occured in updated or created user resume"})
        }
        } catch (error) {
            logger.error(`Exception during updating or creating resume for candidate ID: ${req.body.resumeData.candidate}, error: ${error.message}`);
            return res.status(500).json({ message: "Internal server error" });
        }
    },
    postResumeEducation:async(req,res)=>{
        try {
            const {education}=req.body
            const id=req.user.user._id
            const result=await userUseCase.addResumeEducation(id,education)
            if(result){
                return res.status(200).json({ success: true, message: result.message, resume: result.resume });
            } else {
                return res.status(500).json({ success: false, message: "Failed to add education" });
            }
        } catch (error) {
            logger.error(`Exception during adding education for user ID: ${req.user._id}, error: ${error.message}`);
            return res.status(500).json({ message: "Internal server error" });
        }
    },
    getResumeEducation:async(req,res)=>{
        try {
            const id=req.user.user._id
            const result=await userUseCase.getResumeEducation(id)
            if(result){
                logger.info(`Successfully retrieved education details for candidate ID: ${id}`);
                return res.status(200).json({ success: true, education: result });
            }else{
                logger.warn(`No education details found for candidate ID: ${id}`);
                return res.status(404).json({ success: false, message: result.message });
            }

        } catch (error) {
            logger.error(`Exception during fetching education details for candidate ID: ${req.user._id}, error: ${error.message}`);
            return res.status(500).json({ message: "Internal server error" });
        }
    },
    postResumeSkill:async(req,res)=>{
        try {
            const {skill}=req.body
            const id=req.user.user._id
            const result=await userUseCase.addResumeSkill(id,skill)
            if(result){
                return res.status(200).json({ success: true, message: result.message, resume: result.resume });
            } else {
                return res.status(500).json({ success: false, message: "Failed to add skill" });
            }
        } catch (error) {
            logger.error(`Exception during adding skill for user ID: ${req.user._id}, error: ${error.message}`);
            return res.status(500).json({ message: "Internal server error" });
        }
    },
    getResumeSkill:async(req,res)=>{
        try {
            const id=req.user.user._id
            const result=await userUseCase.getResumeSkill(id)
            if(result){
                logger.info(`Successfully retrieved skill details for candidate ID: ${id}`);
                return res.status(200).json({ success: true, skill: result });
            }else{
                logger.warn(`No skill details found for candidate ID: ${id}`);
                return res.status(404).json({ success: false, message: result.message });
            }
        } catch (error) {
            logger.error(`Exception during fetching skill details for candidate ID: ${req.user._id}, error: ${error.message}`);
            return res.status(500).json({ message: "Internal server error" });
        }
    },


}
export default resumeControl
import userUseCase from "../../../Application/Usecase/userUsecase.js";
import logger from "../../../Framework/Utilis/logger.js";

const resumeControl={
    postUserDetails:async(req,res)=>{
        try {
            const {resumeData}=req.body
            console.log(resumeData,"DATA");
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
    }

}
export default resumeControl
import { Application } from "../../Core/Entities/applicationCollection.js"
import logger from "../Utilis/logger.js"


const applicationRepository={
    postApplication:async(applicationData)=>{
        try {
            const newApplication = new Application(applicationData)
            await newApplication.save()
            logger.info(`Created jobApplication: ${newApplication._id}`);
            return newApplication
        } catch (error) {
            logger.error(`Error in applying job: ${error}`);
        }
    },
    getApplicationByRecruiter:async(id)=>{
        try {
            const application=await Application.find({employerId:id})
            if(!application){
                logger.warn(`No applications found for recruiter ID: ${id}`);
            }else{
                logger.info(`Fetched applications for recruiter ID: ${id}`);
            }
            return application
        } catch (error) {
            logger.error(`Error fetching applications for recruiter ID: ${id} - ${error.message}`);
        }
    },
    getApplicationDetails:async(id)=>{
        try {
            const application=await Application.findOne({_id:id})
            if(!application){
                logger.warn(`No application found for application ID: ${id}`);
            } else {
                logger.info(`Fetched application details for application ID: ${id}`);
            }
            return application
        } catch (error) {
            logger.error(`Error fetching application details for application ID: ${id} - ${error.message}`);
        }
    },
    getApplicationforCandidates:async(id)=>{
        try {
            const application=await Application.find({applicant:id}).populate('jobId')
            if(!application){
                logger.warn(`No applications found for candidate ID: ${id}`);
            }else{
                logger.info(`Fetched applications for candidate ID: ${id}`);
            }
            return application
        } catch (error) {
            logger.error(`Error fetching applications for candidate ID: ${id} - ${error.message}`);
        }
    }

}
export default applicationRepository
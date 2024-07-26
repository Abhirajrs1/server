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
    }

}
export default applicationRepository
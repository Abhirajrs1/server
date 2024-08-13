import { Plans } from "../../Core/Entities/planCollection.js";
import logger from "../Utilis/logger.js";


const planRepository={
    existingPlan:async(planName)=>{
        try {
            const existingPlan=await Plans.findOne({planName:new RegExp(`^${planName}$`, 'i')})
            if(existingPlan){
                logger.info(`Plan with the name "${planName}" already exists.`);
            }
            return existingPlan
        } catch (error) {
            logger.error(`Failed to check if plan exists. Error: ${error.message}`, { error });
        }
    },
    addPlans:async(data)=>{
        try {
            const result= new Plans(data)
            await result.save()
            logger.info(`Plan added successfully: ${JSON.stringify(data)}`)
            return result
        } catch (error) {
            logger.error(`Failed to add plan. Error: ${error.message}`, { error });
        }
    },
    getPlans:async(page,limit)=>{
        try {
            const skip=(page-1)*limit
            const plans=await Plans.find().skip(skip).limit(limit)
            const total=await Plans.countDocuments()
            logger.info(`Fetched ${plans.length} plans. Page: ${page}, Limit: ${limit}`);
            return {plans,total}
        } catch (error) {
            logger.error(`Failed to fetch plans. Error: ${error.message}`, { error, page, limit });
        }
    },
    getPlansForRecruiter:async()=>{
        try {
            const plans=await Plans.find({})
            logger.info(`Fetched ${plans.length} plans.`);
            return plans
        } catch (error) {
            logger.error(`Failed to fetch plans. Error: ${error.message}`);
        }
    }

}
export default planRepository
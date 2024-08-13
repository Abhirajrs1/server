import logger from "../../Framework/Utilis/logger.js";
import planRepository from "../../Framework/Repositories/planRepository.js";


const planUseCase={

    addPlans:async(data)=>{
        try {
            const {planName,planDescription,planPrice,planType,planDuration} = data
            const existingPlans=await planRepository.existingPlan(planName)
            if(existingPlans){
                logger.warn(`Failed to add plan: Plan with name "${planName}" already exists.`);
                return { message: "Plan with this name already exists."};
            }
            const result=await planRepository.addPlans({
                planName:planName,
                amount:planPrice,
                description:planDescription,
                planType:planType,
                planDuration:planDuration
            })
            if(!result){
                logger.warn("Plan was not added successfully.");
                return {message:"Plans didn't add successfully"}
            }
            logger.info(`Plan added successfully: ${JSON.stringify(result)}`);
            return result
        } catch (error) {
            logger.error(`Failed to add plan. Error: ${error.message}`, { error });
        }
    },
    getPlans:async(page,limit)=>{
        try {
          const {plans,total} = await planRepository.getPlans(page,limit)
          if(!plans){
            logger.warn("No plans found");
            return { message: "No plans found" };
          }
          logger.info(`Fetched ${plans.length} plans. Page: ${page}, Limit: ${limit}`);
          return { plans, total };
        } catch (error) {
            logger.error(`Failed to fetch plans. Error: ${error.message}`, { error, page, limit });
        }
    },
    getPlansForRecruiter:async()=>{
        try {
            const plans=await planRepository.getPlansForRecruiter()
            if(!plans){
                logger.warn("No plans found");
                return { message: "No plans found" };
            }
            logger.info(`Fetched ${plans.length} plans.`);
             return plans
        } catch (error) {
            logger.error(`Failed to fetch plans. Error: ${error.message}`);
    }
}
}
export default planUseCase
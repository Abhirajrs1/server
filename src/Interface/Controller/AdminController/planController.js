import logger from "../../../Framework/Utilis/logger.js";
import planUseCase from "../../../Application/Usecase/planUsecase.js";


const planController={

    addPlans:async(req,res)=>{
        try {
            const {formData} = req.body
            const result =await planUseCase.addPlans(formData)
            if(result.message){
                logger.warn(`Failed to add plan: ${result.message}`);
                return res.status(400).json({success:false,message:result.message})
            }
            logger.info("Plan added successfully.");
            return res.status(201).json({success:true,message:"Plans added successfully"})
        } catch (error) {
            logger.error(`Error adding plan: ${error.message}`, { error });
            return res.status(500).json({ success: false, message: "An error occurred while adding the plan" });
        }
    },
    getPlans:async(req,res)=>{
        try {
            const page=parseInt(req.query.page) || 1
            const limit=parseInt(req.query.limit) || 5
            const planData=await planUseCase.getPlans(page,limit)
            if(planData.message){
                logger.warn(`Failed to retrieve plans: ${planData.message}`);
                return res.status(404).json({ success: false, message: planData.message });
            }

            logger.info(`Plans retrieved successfully. Page: ${page}, Limit: ${limit}`);
            return res.status(200).json({ success: true, plans: planData.plans, total: planData.total });
        } catch (error) {
            logger.error(`Error fetching plans: ${error.message}`, { error });
            return res.status(500).json({ success: false, message: "An error occurred while fetching plans" });
        }
    },
}
export default planController
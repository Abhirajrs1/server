import { Orders } from "../../Core/Entities/orderCollection.js";
import { Recruiter } from "../../Core/Entities/recruiterCollection.js";
import logger from "../Utilis/logger.js";

const orderRepository={

    createNewOrder:async(orderData)=>{
        try {
            const newOrder=new Orders(orderData)
            const savedOrder=await newOrder.save()
            logger.info(`New order created successfully with ID: ${savedOrder._id} for user: ${orderData.userId}`);
            return savedOrder; 
        } catch (error) {
            logger.error(`Failed to create a new order for user: ${orderData.userId}. Error: ${error.message}`, { error });
        }

    }

}

export default orderRepository
import { Chat } from "../../Core/Entities/chatCollection.js";
import { User } from "../../Core/Entities/userCollection.js";
import { Recruiter } from "../../Core/Entities/recruiterCollection.js";
import logger from "../Utilis/logger.js";

const chatRepository = {
    // U
    findChat: async (jobId,userId,recruiterId) => {
        try {
            const existingRoom=await Chat.findOne({
                jobId,
                members:{$all:[userId,recruiterId]}
            })
            if (!existingRoom) {
                logger.info(`Chat not found for jobId: ${jobId}, userId: ${userId}, recruiterId: ${recruiterId}`);
                return null;
            }
            const recruiter = await Recruiter.findById(recruiterId).select('recruitername email _id');


            logger.info(`Chat found for jobId: ${jobId}, userId: ${userId}, recruiterId: ${recruiterId}`);
            return {
                chatRoom: existingRoom,
                recruiter
            };
            } catch (error) {
            logger.error(`Error finding chat: ${error.message}`);
        }
    },
    // U
    createChat: async (jobId, userId, recruiterId) => {
        try {
            const newChat = new Chat({
                members: [userId, recruiterId],
                jobId
            });
            const savedChat = await newChat.save();
            const recruiter = await Recruiter.findById(recruiterId).select('recruitername email _id');

            logger.info(`Chat created successfully for jobId: ${jobId}, userId: ${userId}, recruiterId: ${recruiterId}`);
            return {
                chatRoom: savedChat,
                recruiter
            };        
        } catch (error) {
            logger.error(`Error creating chat: ${error.message}`);
        }
    },

    // U
    getChatsByRecruiter: async (recruiterId) => {
        try {
            return await Chat.find({ members: recruiterId }).populate({
                path:'members',
                select:'username email',
                model:User
            })
        } catch (error) {
            logger.error(`Error getting chats for recruiter: ${error.message}`);
            throw error;
        }
    }
};

export default chatRepository;

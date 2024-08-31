import { Chat } from "../../Core/Entities/chatCollection.js";
import logger from "../Utilis/logger.js";

const chatRepository = {
    createRoom:async(jobId,employerId,userId)=>{
        try {
            const newChat=new Chat({
                members:[userId,employerId],
                jobId
            })
            return await newChat.save()
        } catch (error) {
            
        }

    },
    existingRoom:async(jobId,employerId,userId)=>{
        try {
            const existingRoom=await Chat.findOne({
                jobId,
                members:{$all:[userId,employerId]}
            })
            return existingRoom
        } catch (error) {
            
        }

    },
    findChat: async (jobId, userId) => {
        try {
            return await Chat.findOne({ jobId, members: userId }).populate('members');
        } catch (error) {
            logger.error(`Error finding chat: ${error.message}`);
            throw error;
        }
    },
    createChat: async (jobId, userId, recruiterId) => {
        try {
            const newChat = new Chat({
                members: [userId, recruiterId],
                jobId
            });
            return await newChat.save();
        } catch (error) {
            logger.error(`Error creating chat: ${error.message}`);
            throw error;
        }
    },
    getChatsByUser: async (userId) => {
        try {
            return await Chat.find({ members: userId }).populate('members').populate('jobId');
        } catch (error) {
            logger.error(`Error getting chats for user: ${error.message}`);
            throw error;
        }
    },
    getChatsByRecruiter: async (recruiterId) => {
        try {
            return await Chat.find({ members: recruiterId }).populate('members').populate('jobId');
        } catch (error) {
            logger.error(`Error getting chats for recruiter: ${error.message}`);
            throw error;
        }
    }
};

export default chatRepository;

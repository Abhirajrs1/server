import chatRepository from "../../Framework/Repositories/chatRepository.js";
import messageRepository from "../../Framework/Repositories/messageRepository.js";
import logger from "../../Framework/Utilis/logger.js";

const chatUseCase = {
    // U
    createRoom:async(jobId,userId,employerId)=>{
        try {
            const existingRoom=await chatRepository.findChat(jobId,userId,employerId)
            if (existingRoom) {
                logger.info('Chat room already exists', { existingRoom });
                return existingRoom;
            }
            const newRoom = await chatRepository.createChat(jobId, userId, employerId);
            logger.info('Chat room created successfully', { newRoom });
            return newRoom;
        } catch (error) {
            logger.error(`Error creating chat room: ${error.message}`, { jobId, userId, employerId, error });
        }
    },
    // U
    findChatRoom:async(jobId,userId,employerId)=>{
        try {
            const room=await chatRepository.findChat(jobId,userId,employerId)
            if (room) {
                logger.info('Chat room found', { room });
            } else {
                logger.warn('No chat room found', { jobId, userId, employerId });
            }
            return room
        } catch (error) {
            logger.error(`Error finding chat room: ${error.message}`, { jobId, userId, employerId, error });
        }
    },
    // U
    saveMessages: async (message, id, userId) => {
        try {            
            const savedMessage = await messageRepository.saveMessage(message, id, userId);
            return savedMessage; 
        } catch (error) {
            console.error('Error saving message in use case:', error);
        }
    },
    // U
    getMessages: async (chatId) => {
        try {
            return await messageRepository.getMessagesByChatId(chatId);
        } catch (error) {
            logger.error(`Error in getMessages use case: ${error.message}`);
        }
    },
    // U
    getChatsByRecruiter: async (recruiterId) => {
        try {
            const chats=await chatRepository.getChatsByRecruiter(recruiterId);
            logger.info(`Fetched chats for recruiter ${recruiterId}`);
            return chats;
        } catch (error) {
            logger.error(`Error in getChatsByRecruiter use case: ${error.message}`);
        }
    },
   
};

export default chatUseCase;

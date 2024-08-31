import chatRepository from "../../Framework/Repositories/chatRepository.js";
import messageRepository from "../../Framework/Repositories/messageRepository.js";
import logger from "../../Framework/Utilis/logger.js";

const chatUseCase = {
    createRoom:async(jobId,employerId,userId)=>{
        try {
            const existingRoom=await chatRepository.existingRoom(jobId,employerId,userId)
            if(existingRoom){
                return existingRoom
            }
            return await chatRepository.createRoom(jobId,employerId,userId)
        } catch (error) {
            
        }

    },

    initiateChat: async (jobId, userId, recruiterId) => {
        try {
            let chat = await chatRepository.findChat(jobId, userId);
            if (!chat) {
                chat = await chatRepository.createChat(jobId, userId, recruiterId);
            }
            return chat;
        } catch (error) {
            logger.error(`Error in initiateChat use case: ${error.message}`);
        }
    },
    saveMessages: async (message, id, userId) => {
        try {            
            const savedMessage = await messageRepository.saveMessage(message, id, userId);
            return savedMessage; 
        } catch (error) {
            console.error('Error saving message in use case:', error);
        }
    },
    

    getChatsByUser: async (userId) => {
        try {
            return await chatRepository.getChatsByUser(userId);
        } catch (error) {
            logger.error(`Error in getChatsByUser use case: ${error.message}`);
        }
    },
    getChatsByRecruiter: async (recruiterId) => {
        try {
            return await chatRepository.getChatsByRecruiter(recruiterId);
        } catch (error) {
            logger.error(`Error in getChatsByRecruiter use case: ${error.message}`);
        }
    },
    sendMessage: async (chatId, senderId, text) => {
        try {
            return await messageRepository.createMessage(chatId, senderId, text);
        } catch (error) {
            logger.error(`Error in sendMessage use case: ${error.message}`);
        }
    },
    getMessages: async (chatId) => {
        try {
            return await messageRepository.getMessagesByChatId(chatId);
        } catch (error) {
            logger.error(`Error in getMessages use case: ${error.message}`);
        }
    }
};

export default chatUseCase;

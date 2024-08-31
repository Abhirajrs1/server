import { Message } from "../../Core/Entities/messageCollection.js";
import logger from "../Utilis/logger.js";

const messageRepository = {

    saveMessage: async (message, id, userId) => {
        try {
            console.log(message, id, userId, "ID");
            const newMessage = new Message({
                text: message,
                chatId: id,
                senderId: userId
            });
            return await newMessage.save();
        } catch (error) {
            console.error('Error saving message in repository:', error);
        }
    },
    // createMessage: async (chatId, senderId, text) => {
    //     try {
    //         const newMessage = new Message({
    //             chatId,
    //             senderId,
    //             text
    //         });
    //         return await newMessage.save();
    //     } catch (error) {
    //         logger.error(`Error creating message: ${error.message}`);
    //         throw error;
    //     }
    // },
    getMessagesByChatId: async (chatId) => {
        try {
            return await Message.find({ chatId }).sort({ createdAt: 1 }).populate('senderId');
        } catch (error) {
            logger.error(`Error getting messages for chatId: ${chatId}: ${error.message}`);
            throw error;
        }
    }
};

export default messageRepository;

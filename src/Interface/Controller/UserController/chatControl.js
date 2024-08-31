import chatUseCase from "../../../Application/Usecase/chatUsecase.js";
import logger from "../../../Framework/Utilis/logger.js";
const chatController = {

    createRoom:async(req,res)=>{
        try {
            const {jobId,employerId}=req.body
            const userId=req.user.user._id
            const room=await chatUseCase.createRoom(jobId,employerId,userId)
            if (room){
                return res.status(200).json({success:true,message:"Room data",room})
            }
        } catch (error) {
            console.log(error);
            
        }
    },
    initiateChat: async (req, res) => {
        try {
            console.log("FIND MESSAGES");
            const {room} = req.body            
            const userId=req.user.user._id
            const chat = await chatUseCase.initiateChat(jobId, userId, recruiterId);
            res.status(200).json({ success: true, chat });
        } catch (error) {
            logger.error(`Error initiating chat: ${error.message}`);
            res.status(500).json({ success: false, message: 'Error initiating chat' });
        }
    },
    saveMessage:async(req,res)=>{
        try {
            const {message,room}=req.body
            const id=room._id
            const userId=req.user.user._id
            console.log(message,"MESSAGE");
            
            const result=await chatUseCase.saveMessages(message,id,userId)
        } catch (error) {
            console.log(error);
            
        }
    
        

    },

    getChatsByUser: async (req, res) => {
        try {
            const { userId } = req.params;
            const chats = await chatUseCase.getChatsByUser(userId);
            res.status(200).json({ success: true, chats });
        } catch (error) {
            logger.error(`Error fetching chats: ${error.message}`);
            res.status(500).json({ success: false, message: 'Error fetching chats' });
        }
    },

    getChatsByRecruiter: async (req, res) => {
        try {
            const { recruiterId } = req.params;
            const chats = await chatUseCase.getChatsByRecruiter(recruiterId);
            res.status(200).json({ success: true, chats });
        } catch (error) {
            logger.error(`Error fetching chats: ${error.message}`);
            res.status(500).json({ success: false, message: 'Error fetching chats' });
        }
    },

    sendMessage: async (req, res) => {
        try {
            const { chatId, senderId, text } = req.body;
            const message = await chatUseCase.sendMessage(chatId, senderId, text);
            res.status(200).json({ success: true, message });
        } catch (error) {
            logger.error(`Error sending message: ${error.message}`);
            res.status(500).json({ success: false, message: 'Error sending message' });
        }
    },

    getMessages: async (req, res) => {
        try {
            const { chatId } = req.params;
            const messages = await chatUseCase.getMessages(chatId);
            res.status(200).json({ success: true, messages });
        } catch (error) {
            logger.error(`Error fetching messages: ${error.message}`);
            res.status(500).json({ success: false, message: 'Error fetching messages' });
        }
    }
};

export default chatController;

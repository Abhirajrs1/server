import chatUseCase from "../../../Application/Usecase/chatUsecase.js";
import logger from "../../../Framework/Utilis/logger.js";
const chatController = {

    createRoom:async(req,res)=>{
        try {
            const {jobId,employerId}=req.body
            const userId=req.user.user._id
            const room=await chatUseCase.createRoom(jobId,userId,employerId)
            if (room) {
                logger.info('Chat room created successfully', { room });
                return res.status(200).json({ success: true, message: "Room data", room });
            } else {
                logger.warn('Failed to create chat room', { jobId, employerId, userId });
                return res.status(400).json({ success: false, message: 'Failed to create room' });
            }
        } catch (error) {
            logger.error(`Error creating chat room: ${error.message}`, { error });
            res.status(500).json({ success: false, message: 'Error creating chat room' });            
        }
    },
    getChatRoom:async(req,res)=>{
        try {
            const {jobId,employerId}=req.params
            const userId=req.user.user._id
            const room=await chatUseCase.findChatRoom(jobId,userId,employerId)
            if (room) {
                logger.info('Chat room found', { room });
                return res.status(200).json({ success: true, room });
            } else {
                logger.warn('Chat room not found', { jobId, employerId, userId });
                return res.status(404).json({ success: false, message: 'No chat room found' });
            }
        } catch (error) {
            logger.error(`Error getting chat room: ${error.message}`);
            res.status(500).json({ success: false, message: 'Error getting chat room' });
        }
    },
    // initiateChat: async (req, res) => {
    //     try {
    //         const {room} = req.body       
    //         const userId=req.user.user._id
    //         const recruiterId=room.members.find(member=>member!==userId)            
    //         const jobId=room.jobId  
    //         const chat = await chatUseCase.initiateChat(jobId ,userId,recruiterId);
    //         res.status(200).json({ success: true, chat });
    //     } catch (error) {
    //         logger.error(`Error initiating chat: ${error.message}`);
    //         res.status(500).json({ success: false, message: 'Error initiating chat' });
    //     }
    // },
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

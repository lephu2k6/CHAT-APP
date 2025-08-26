const Usermodel = require('../models/user.model')
const MessageModel = require('../models/message.model')
const cloudinary = require ('../config/cloudinary')
const { getReceiverSocketId } = require('../config/socket')


const getUsersForSidebar = async (req , res) => {
    try {
        const loggedInUserId = req.user._id
        const filteredUsers = await Usermodel.find({_id : {$ne : loggedInUserId}}).select('-password')
        res.status(200).json(filteredUsers) 
    }catch(err) {
        console.log(err)
        res.status(500).json({
            message: "Lỗi server"
        })
    }
}
const getMessages = async (req, res) => {
    try {
        const {id:userToChatId} = req.params 
        const MyId = req.user._id  
        const Message = await MessageModel.find({
            $or : [
                {senderId : MyId  , receiverId:userToChatId } , 
                {receiverId: MyId ,senderId:userToChatId } 
            ]
        }).sort({ createdAt: 1 })
        res.status(200).json({
            Message : Message 
        })
    } catch (error) {
        console.log(error) 
        res.status(500).json({
            message : 'Lỗi Server'
        })
    }
}
const sendMessage = async(req,res) => {
    try {
        const {text , image } = req.body 
        const {id: receiverId} = req.params 
        const senderId = req.user._id
        let imageUrl 
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image) 
            imageUrl = uploadResponse.secure_url
        }
        const newMessage = new MessageModel(
            {
                senderId,
                receiverId,
                text , 
                image : imageUrl
            }
        )
        
        await newMessage.save()
        const { io } = require('../config/socket');
        const receiverSocketId = getReceiverSocketId(receiverId);
        // Emit to receiver if online
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage);
            console.log('Emit newMessage to receiver:', receiverSocketId);
        }
        // Emit to sender (for instant update)
        const senderSocketId = getReceiverSocketId(senderId);
        if (senderSocketId) {
            io.to(senderSocketId).emit('newMessage', newMessage);
            console.log('Emit newMessage to sender:', senderSocketId);
        }
        res.status(200).json(newMessage)

        
    } catch (error) {
        console.log(error) 
        res.status(500).json({
            message: 'Lỗi Server',
            error: error.message
        })
    }
}
module.exports = {getUsersForSidebar,getMessages,sendMessage}
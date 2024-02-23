const mongoose = require('mongoose');
const chatSchema = new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.ObjectId,
        required:true,
        ref:'User',
    },
    receiverId:{
        type:mongoose.Schema.ObjectId,
        required:true,
        ref:'User',
    },
    message: {
        type:String,
        required:true,
    },
} , 
{
    timestamps:true
}
)

module.exports = mongoose.model('Chat' , chatSchema);
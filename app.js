require('dotenv').config();
const mongoose = require('mongoose');
const app = require('express')();
const http = require('http').Server(app);
const userRoute = require('./routes/userRoute');
const io = require('socket.io')(http);
const User = require('./models/userModel');

mongoose.connect(process.env.MONGO_URL);
let port = process.env.PORT || 5000;


// middleware
app.use('/' , userRoute);
// app.use(session({ resave: true ,secret: process.env.SESSION_KEY , saveUninitialized: true}));


let unsp = io.of('/user-namespace');
unsp.on('connection' , async (socket) => {
    // let user = await User.findById(socket.handshake.auth.sender_id);
    // user.isOnline = 1;
    // await user.save();
    // console.log('user' , user);
    let sender = await User.findByIdAndUpdate({_id:socket.handshake.auth.sender_id}, { $set: { isOnline: 1 }});
    
    
    // BROADCASTING ONLINE-STATUS
    socket.broadcast.emit('getOnlineStatus' , {_id:socket.handshake.auth.sender_id});
    console.log("user connected");
    socket.on('save-chat' , body => {
        socket.broadcast.emit('new-chat' , body);
    })
    
    socket.on('disconnect' , async () => {
        let sender = await User.findByIdAndUpdate({_id:socket.handshake.auth.sender_id}, { $set: { isOnline: 0 }});
        

        // BROADCASTING OFFLINE-STATUS
        socket.broadcast.emit('getOfflineStatus' , {_id:socket.handshake.auth.sender_id});
        console.log("user disconnected");
    })
})



http.listen(port , err => {
    if(err) {
        console.log(err);
    }
    else {
        console.log("server is running on port" , port);
    }
})
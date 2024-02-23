const User = require('../models/userModel');
const Chat = require('../models/chatModel');
const bcrypt = require('bcrypt');


const resisterLoad = async(req , res) => {
    try {
        res.render('resister');
    }
    catch(err) {
        console.log(err.message);
    }
};



const resister = async (req , res) => {
    try {
        let {name , email , password} = req.body;
        let image = 'images/' + req.file.filename;
        password = await bcrypt.hash(password , 10);

        const user = new User({
            name ,
            email,
            password , 
            image,
        })
        await user.save();
        res.render('resister' , {message:"rsistration successful!!!"})
    }
    catch(err) {
        console.log(err.message);        
    }
};



const login = async (req , res) => {
    try {
        let userData = await User.findOne({email:req.body.email});
        // console.log(userData , req.body);

        if(!userData) {
            res.render('login' , {message:"Invalid Credentials"});
        }
        let ok = bcrypt.compare(req.body.password , userData.password);
        if(ok) {
            req.session.user = userData;
            res.redirect('/dashboard');
        }
        else {
            res.render('login' , {message:"Invalid Credentials"});
        }
    } catch(err) {
        console.log(err.message);
    }
}



const loginLoad = async (req , res ) => {
    try {
        res.render('login');
    } catch(err) {
        console.log(err.message);
    }
}



const loadDashboard = async (req , res) => {
    try {
        res.render('dashboard' , {user:req.session.user});
    } catch(err) {
        console.log(err.message);
    }
}



const logout = async (req , res) => {
    try {
        req.session.destroy();
        res.redirect('/');
    } catch(err) {
        console.log(err.message);
    }
}


const users = async (req , res) => {
    try {
        let users = await User.find({_id : {$nin :[req.session.user]}});
        res.render('dashboard' , {user:req.session.user , users});
       // console.log(users);
        // res.redirect('/');
    } catch(err) {
        console.log(err.message);
    } 
}


const saveChat = async(req , res) => {
    try {
        let chat = new Chat(req.body);
        await chat.save();
        res.send({success:true});
    } catch(err) {
        res.send({success:false});
    }
}


const loadChat = async(req , res) => {
    let {senderId , receiverId} = req.body;
    
    try {
        let chats = await Chat.find({$or: [{senderId , receiverId} , {senderId:receiverId , receiverId:senderId}]});
        res.send({success:true , chats});
    } catch(err) {
        console.log(err.message);
        res.send({success:false});
    }
}


module.exports = {
    resister , 
    resisterLoad,
    logout,
    login,
    loginLoad,
    loadDashboard,
    users,
    saveChat,
    loadChat,
};
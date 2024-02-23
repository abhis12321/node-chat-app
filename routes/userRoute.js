const express = require('express');
const user_route = express();
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const session = require('express-session');
const auth = require('../middlewares/auth')

user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}));

user_route.use(session({ resave: true ,secret: process.env.SESSION_KEY , saveUninitialized: true}));
user_route.set('view engine' , 'ejs');
user_route.set('views' , './views');

user_route.use(express.static('public'));

const storage = multer.diskStorage({
     destination:(req , file , cb) => {
         cb(null , path.join(__dirname , '../public/images'));
     },
     filename:(req, file , cb) => {
        const name = Date.now() + '-' + file.originalname; 
        cb(null , name);
     }
});

const upload = multer({storage:storage});
const userController = require('../controllers/userController');

user_route.get('/resister' , auth.isLogout , userController.resisterLoad);
user_route.post('/resister' , auth.isLogout , upload.single('image')  , userController.resister);

user_route.get('/' , auth.isLogout , userController.loginLoad);
user_route.post('/' , auth.isLogout , userController.login);

user_route.get('/logout' , auth.isLogin , userController.logout);
user_route.get('/dashboard' , auth.isLogin , userController.loadDashboard);
user_route.get('/users' , auth.isLogin , userController.users);

user_route.post('/savechat' , userController.saveChat);
user_route.post('/loadchat' , userController.loadChat);

user_route.post('*' , (req , res) => {
    res.redirect('/');
});



module.exports = user_route;
const user = require('express').Router();
const mongoose = require('mongoose');
const User = require('../models/User')
const multer = require('multer')
const url = require('url')
const bodyParser = require('body-parser')
const dir = 'C:/Users/HP/djangoProject/javascript/chat-app]'

// database connection
mongoose.connect('mongodb://localhost/user_data')
mongoose.connection.once('open',()=>{
    console.log('connected to database')
}).on('error',(err)=>{
    console.log(err)
})

// body-parser
user.use(bodyParser.urlencoded({ extended: false }))

// file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, dir+'/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, Math.floor(100000 + Math.random() * 900000)+'-'+ Date.now())
    }
  })
   
const upload = multer({ storage: storage })


user.use((req,res,next)=>{
    next()
})

user.get('/all', (req,res)=>{
    User.find().then(user=>{
        res.send(user)
    })
})

user.get('/delete', (req,res)=>{
    User.remove({},function(err,removed){
        res.send(removed)
    })
})

user.get('/login', (req,res)=>{
    res.sendFile(dir+"/views/static/login.html")
})

user.get('/signin', (req,res)=>{
    res.sendFile(dir+"/views/static/signin.html")
})

user.post('/login', (req,res)=>{
    User.findOne(req.body).then(user_data=>{
        const query = '?user='+JSON.stringify({...user_data,password:null,_id:null})
        res.redirect('/'+query)
    })
})


user.post('/signin', upload.single('image'), (req,res)=>{
    User.create({
        ...req.body,
        image : req.file.filename
    }).then(user=>{
        res.send(user._id)
    })
})

user.get('/find/:keyword', (req,res)=>{
    const keyword = req.params.keyword
    User.find({name : keyword}).then(users=>{
        const users_data = users.map(user=>{
            return({
                ...user,
                password : null
            })
        })
        console.log(users_data)
        res.render('search-freind',{users: users_data})
    })
})

module.exports = user;
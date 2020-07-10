const user = require('express').Router();
const mongoose = require('mongoose');
const User = require('../models/User')
const multer = require('multer')
const url = require('url')
const bodyParser = require('body-parser')
const dir = 'C:/Users/HP/djangoProject/javascript/chat-app'

// database connection
mongoose.connect('mongodb://localhost/user_data')
mongoose.connection.once('open',()=>{
    console.log('connected to database')
}).on('error',(err)=>{
    console.log(err)
})

// body-parser
user.use(bodyParser.urlencoded({ extended: false }))

// random number generator
function randomNumber(){
    return(Math.floor(100000 + Math.random() * 900000)+'')
}

// file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, dir+'/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, randomNumber()+'-'+ Date.now())
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
        const query = '?user='+JSON.stringify({...user_data,password:null})
        res.redirect('/'+query)
    })
})


user.post('/signin', upload.single('image'), (req,res)=>{
    User.create({
        ...req.body,
        image : req.file.filename,
        friends : [{
            email : 'null'+randomNumber()
        }]
    }).then(user=>{
        res.send(user._id)
    })
})

user.get('/find', (req,res)=>{
    const keyword = req.query.keyword
    if(keyword == undefined){
        res.render('search-freind',{users: []})
    }
    else{
    User.find({name : keyword}).then(users=>{
        const users_data = users.map(user=>{
            return({
                email : user.email,
                name : user.name,
                image : user.image,
            })
        })
        res.render('search-freind',{users: users_data})
    })
    }
})

user.get('/add/:id', (req,res)=>{
    const id = req.params.id, friend = {...req.query, email: req.query.email+randomNumber()}
    User.findOne({_id : id}).then(user=>{
        let friends = user.friends
        if(!friends.find(fri=>fri==friend)){
            friends.push(friend)
        }
        User.findOneAndUpdate({_id: id}, {friends: friends}).then(()=>{
            User.findOne({_id : id}).then(user=>{
                const query = '?user='+JSON.stringify({...user,password:null})
                res.redirect('/'+query)
            })
        })
    })
})

user.get('/image/:img', (req,res)=>{
    res.sendFile(dir+'/uploads/'+req.params.img)
})

user.get('/upd', (req,res)=>{
    User.findOneAndUpdate({_id: '5ef2fb29525923171cfd280b'},{image: 'default'})
    res.send('done')
})


module.exports = user;
const express = require('express');
const app = express();
const http = app.listen(3000);
const user = require('./Routes/user');
const io = require('socket.io')(http);


app.use(express.static(__dirname + '/views/static/'));
app.set('view engine','ejs')

app.use('/user', user)


app.get('/', (req,res)=>{
    let user = JSON.parse(req.query.user)._doc
    let friends = user.friends.map(friend=>{
        if(friend.email.slice(0,-6)!='null'){
            return({...friend,email : friend.email.slice(0,-6)})
        }
    })
    friends = friends.filter(friend=>friend!=undefined)
    user.friends = friends
    res.render('index', {user : user})
})

app.get('/chat', (req,res)=>{
    res.render('chat',{mymail:req.query.mymail, fmail:req.query.fmail, fname:req.query.fname, fimage : req.query.fimage})
})


io.on('connection', socket=>{
    socket.emit('connected','done')

    socket.on('join', (data)=>{
        socket.join(data.room)
        socket.broadcast.to(data.room).emit('status', data)
    })

    socket.on('response-to-status', data=>{
        socket.broadcast.to(data.room).emit('response-status',data.id)
    })

    socket.on('msg', (data)=>{
        socket.broadcast.to(data.to).emit('chat', {from: data.from, msg: data.msg , msgid: data.msgid})
    })

    socket.on('readed',(data)=>{
        socket.broadcast.to(data.room).emit('read', data.msgid)
    })

})

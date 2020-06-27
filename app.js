const express = require('express');
const app = express();
const http = app.listen(3000);
const user = require('./Routes/user');
const io = require('socket.io')(http);


app.use(express.static(__dirname + '/views/static/'));
app.set('view engine','ejs')

app.use('/user', user)


app.get('/', (req,res)=>{
    const user = JSON.parse(req.query.user)._doc
    res.render('index', {myemail : user.email, friends : user.friends})
})

app.get('/chat/:room', (req,res)=>{
    res.send(req.params.room)
})

// 

io.on('connection', socket=>{
    socket.emit('connected','done')

    socket.on('join', (data)=>{
        socket.join(data.room)
        socket.broadcast.to(data.room).emit('status', data)
    })

    socket.on('response-to-status', data=>{
        socket.broadcast.to(data.room).emit('response-status',data.id)
    })

})

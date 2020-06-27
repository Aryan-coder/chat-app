const socket = io()
const myemail = document.getElementById('myemail').innerHTML
const friend = document.getElementsByClassName('friend')


socket.on('connected',res=>{
    socket.emit('join',{room : myemail, id : myemail})
})

for(let i in friend){
    socket.emit('join',{room : friend[i].id, id : myemail})
}

socket.on('status',(data)=>{
    document.getElementById('status'+data.id).innerHTML = 'online'
    socket.emit('response-to-status',{room : data.room, id : myemail})
})
//response-status 
socket.on('response-status',(data)=>{
    document.getElementById('status'+data.id).innerHTML = 'online'
})
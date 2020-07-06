const socket = io()
const myemail = document.getElementById('myemail').innerHTML
const id = document.getElementById('id').innerHTML
const friend = document.getElementsByClassName('friend')

console.log(document.getElementsByClassName('online')[0].id)

socket.on('connected',res=>{
    socket.emit('join',{room : myemail, id : myemail})
})

for(let i in friend){
    socket.emit('join',{room : friend[i].id, id : myemail})
}

socket.on('status',(data)=>{
    document.getElementById('status'+data.id).innerHTML = 'online'
    sendUnreadMSGs()
    socket.emit('response-to-status',{room : data.room, id : myemail})
})
//response-status 
socket.on('response-status',(id)=>{
    document.getElementById('status'+id).innerHTML = 'online'
})

socket.on('chat',(data)=>{
    const name = document.getElementById('name'+data.from)
    name.innerHTML = '<div class="sameline">'+ name.innerHTML + '<i class="material-icons" style="color: wheat;">chat_bubble</i>'+'</div>'
})

function sendUnreadMSGs(){
    console.log('call')
    for(i in friend){
        const msgs = getMSGs({
            fid : friend[i].id,
            myid : myemail,
        })
        msgs.forEach(msg=>{
            if(!msg.readed){
                console.log(msg.text)
            }
        })
    }
    
}


localStorage.setItem('id',id)

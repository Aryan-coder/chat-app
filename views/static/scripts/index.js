const socket = io()
const myemail = document.getElementById('myemail').innerHTML
const id = document.getElementById('id').innerHTML
const friend = document.getElementsByClassName('friend')

console.log(document.getElementsByClassName('online')[0].id)

var got_msgs = false

socket.on('connected',res=>{
    socket.emit('join',{room : myemail, id : myemail})
})

for(let i in friend){
    socket.emit('join',{room : friend[i].id, id : myemail})
}

socket.on('status',(data)=>{
    document.getElementById('status'+data.id).innerHTML = 'online'
    if(got_msgs == false){
        sendUnreadMSGs()
    }
    socket.emit('response-to-status',{room : data.room, id : myemail})
})
//response-status 
socket.on('response-status',(id)=>{
    document.getElementById('status'+id).innerHTML = 'online'
})

socket.on('chat',(data)=>{
    const name = document.getElementById('name'+data.from)
    name.innerHTML = '<div class="sameline">'+ name.innerHTML + '<i class="material-icons" style="color: wheat;">chat_bubble</i>'+'</div>'
   appendMSG({
    fid : data.from,
    myid : myemail,
    msg : data.msg
   })
    socket.emit('received', {id : data.msg.id, room : data.from, fid : myemail})
})

function sendUnreadMSGs(){
    got_msgs = true
    console.log('call')
    for(i in friend){
        const msgs = getMSGs({
            fid : friend[i].id,
            myid : myemail,
        })
        msgs.forEach(msg=>{
            if(msg.responce == 'sended'){
            socket.emit('msg', msg)
        }
        })
    }
    
}

socket.on('receive',data=>{
   updResponce({
    fid : data.fmail,
    myid : mymail, 
    msgid : data.msgid,
    responce : 'received'
   })
})

function updResponce(obj){
    const msgs = getMSGs({
        fid : obj.fid,
        myid : mymail, 
    })
    const upd_msgs = msgs.map(msg=>{
        if(msg.id == obj.msgid){
            msg.responce = obj.responce
            if(obj.responce == 'received'){
                msg.text = '<div class="sameline">'+msg.text+'<i style="font-size:medium; margin-left:2px;" class="material-icons">check</i></div>'
            }
            if(obj.responce == 'readed'){
                msg.text = '<div class="sameline">'+msg.text+'<div class="nextline"><i style="font-size:12px; margin-left:2px;" class="material-icons">check</i><i style="font-size:medium; margin-left:6px;margin-top:-10px;" class="material-icons">check</i></div></div>'
            }
        }
        return(msg)
    })
     storeMSGs({
            fid : obj.fid,
            myid : mymail,
            msg : upd_msgs
        })
}

localStorage.setItem('id',id)

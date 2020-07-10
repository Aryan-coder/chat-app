const socket = io()

var scrollingElement = (document.scrollingElement || document.body);
scrollingElement.scrollTop = scrollingElement.scrollHeight

const mymail = document.getElementById('mymail').innerHTML
const fmail = document.getElementById('fmail').innerHTML
var side_temp = '', top_temp = 200, msg_num = 0, msg_list = [],msgs = [], save = true;
restoreMSGs()
document.getElementById('id').innerHTML = ''

socket.on('connected', data=>{
    socket.emit('join',{room : mymail, id : mymail})
    socket.emit('join',{room : fmail, id : mymail})
})

function sideMSG(element,name,msg){
    msg_list.push('<div class="side-msg sameline"><div class="heavy">'+name+' : </div><div class="side-chat">'+msg+'</div></div>')
    let all_msg = ''
    for(let i in msg_list){
        all_msg = msg_list[i] + all_msg
    }
    const side_block = '<div style="height: max-content;width: max-content;margin-top:'+top_temp+'px;">'+all_msg+'</div>'
    element.innerHTML = side_block
    if(msg_num > 6){
        msg_list.pop()
    }
    else{
        msg_num += 1
        top_temp -= 25/msg_num
    }
}

socket.on('chat', data=>{
        if(data.from == fmail){
            document.getElementsByClassName('container')[0].appendChild(msgFormat(mymail, data.msg))
         }
         else{
            const side = document.getElementsByClassName('side')[0]
            sideMSG(side, data.from, data.msg)
        }
        msgs.push(data.msg)
    socket.emit('readed',{room: data.from, msgid: data.msg.id, fid : data.to})
})

socket.on('read',({msgid})=>{
    const msg = document.getElementById(msgid)
    const massges = msgs.map(msg=>{
        if(msg.id==msgid){
            msg.responce = 'readed'
        }
        return msg
    })
    msgs = massges
    msg.innerHTML = '<div class="sameline">'+msg.innerHTML+'<i style="font-size:medium; margin-left:2px;" class="material-icons">check</i><i style="font-size:medium; margin-left:2px;" class="material-icons">check</i></div>'
})

socket.on('receive',({msgid})=>{
    const msg = document.getElementById(msgid)
    const massges = msgs.map(msg=>{
        if(msg.id==msgid){
            msg.responce = 'received'
            msg.text = '<div class="sameline">'+msg.text+'<i style="font-size:medium; margin-left:2px;" class="material-icons">check</i></div>'
        }
        return msg
    })
    msgs = massges
    msg.innerHTML = '<div class="sameline">'+msg.innerHTML+'<i style="font-size:medium; margin-left:2px;" class="material-icons">check</i></div>'
 })

function send(){
    const msg = document.getElementById('text').value
    const msgid = msg+randomNumber()
    if(msg.length==0){
        return(0)
    }
    
    const massage = {
        id: msgid,
        date : date(),
        time : time(),
        text : msg,
        chatof : mymail,
        responce : 'sended'
    }
    msgs.push(massage)
    document.getElementsByClassName('container')[0].appendChild(msgFormat(mymail,massage))
    socket.emit('msg',{to: fmail, from: mymail, msg : massage})
}

addEventListener('mousemove',e=>{
    if(save && e.screenY>150){
        save = false
    }
    if(!save && e.screenY<=150){
        storeMSGs({
            fid : fmail,
            myid : mymail,
            msg : msgs
        })
    }
})

function date(){
    const today = new Date()
    return(today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear())
}

function time(){
    const today = new Date()
    return(today.getHours()+':'+today.getMinutes())
}

function restoreMSGs(){
    msgs = getMSGs({
        fid : fmail,
        myid : mymail
    })

    msgs.forEach(msg => {
        const chat = msgFormat(mymail, msg)
        document.getElementsByClassName('container')[0].appendChild(chat)
    });
}

function msgFormat(id, msg){
    const msg_area = document.createElement('div')
    id == msg.chatof ?  msg_area.className = 'my-msg' :  msg_area.className = 'friend-msg'
    msg_area.innerHTML = '<div class="msg" id="'+msg.id+'">'+msg.text+'</div><div class="msg-info sameline"><div class="msg-info-date">'+msg.date+'</div><div class="msg-info-time">'+msg.time+'</div></div>'
    return(msg_area)
}

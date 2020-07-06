const socket = io()

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
            const chat = document.createElement('div')
            chat.innerText = data.msg
            chat.className = 'friend-msg'
            document.getElementsByClassName('container')[0].appendChild(chat)
         }
         else{
            const side = document.getElementsByClassName('side')[0]
            sideMSG(side, data.from, data.msg)
        }
        msgs.push({
            id: data.msgid,
            date : date(),
            time : time(),
            text : data.msg,
            mychat : false,
        })
    socket.emit('readed',{room: data.from, msgid: data.msgid})
})

socket.on('read',(id)=>{
    const msg = document.getElementById(id)
    msgs[msgs.length-1] = {
        ...msgs[msgs.length-1],
        readed : true
    }
    msg.innerHTML = '<div class="sameline">'+msg.innerHTML+'<i style="font-size:medium; margin-left:2px;" class="material-icons">check</i></div>'
})

function send(){
    const msg = document.getElementById('text').value
    const msgid = msg+randomNumber()
    if(msg.length==0){
        return(0)
    }
    const chat = document.createElement('div')
    chat.className = 'my-msg'
    chat.id = msgid
    chat.innerText = msg
    msgs.push({
        id: msgid,
        date : date(),
        time : time(),
        text : msg,
        mychat : true,
        readed : false
    })
    document.getElementsByClassName('container')[0].appendChild(chat)
    socket.emit('msg',{to: fmail, from: mymail, msg: msg, msgid: msgid})
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
    return(today.getHours()+':'+today.getMinutes()+':'+today.getSeconds())
}

function restoreMSGs(){
    msgs = getMSGs({
        fid : fmail,
        myid : mymail
    })

    msgs.forEach(msg => {
        const chat = document.createElement('div')
        if(msg.mychat){
            chat.className = 'my-msg'
        }
        else{
            chat.className = 'friend-msg'
        }
        chat.id = msg.id
        if(msg.readed==undefined || msg.readed==false){
            chat.innerHTML = msg.text
        }
        else{
            chat.innerHTML = '<div class="sameline">'+msg.text+'<i style="font-size:medium; margin-left:2px;" class="material-icons">check</i></div>'
        }
        document.getElementsByClassName('container')[0].appendChild(chat)
    });
}
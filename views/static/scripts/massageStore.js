/*
const MSG = {
    fid : id,
    myid : myid,
    msg : [{
        id: id,
        date : date,
        time : time,
        text : 'text'
        readed : true
    }]
}
const massage = {
        id: msgid,
        date : date(),
        time : time(),
        text : msg,
        chatof : mymail,
        responce : 'sended'
    }
*/

function storeMSGs(MSG){
    const msg = {
        fid : MSG.fid,
        myid : MSG.myid,
    }
    try{
        localStorage.setItem(JSON.stringify(msg),JSON.stringify(MSG))
        return(true)
    }
    catch(exc){
        return(false)
    }
}

function appendMSG(MSG){
    const msgs = getMSGs({
        fid : MSG.fid,
        myid : MSG.myid,
    })
    msgs.push(MSG.msg)
    storeMSGs({...MSG,msg : msgs})
}


function appendMSGs(MSG){
    let msgs = getMSGs({
        fid : MSG.id,
        myid : MSG.myid,
    })
    MSG.msg.forEach(chat => {
        msgs.push(chat)
    });
    storeMSGs({...MSG,msg : msgs})
}

function getMSGs(msg){
    try{
        const data = localStorage.getItem(JSON.stringify(msg))
        const obj = JSON.parse(data)
        return(obj.msg)
    }
    catch{
        return([])
    }
}
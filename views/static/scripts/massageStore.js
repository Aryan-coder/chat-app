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
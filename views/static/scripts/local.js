const id = localStorage.getItem('id')
const friends = document.getElementsByClassName('add')

for(let i in friends){
friends[i].href = "/user/add/"+id+'?'+friends[i].id
}

function setUnreadMSGs(chats){
    try{
      localStorage.setItem('unread', JSON.stringify(chats))
      return(true)
    }
    catch(exc){
        return(false)
    }
    finally{
        console.log(getUnreadMSGs)
    }
}

function getUnreadMSGs(chats){
    return(JSON.parse(localStorage.getItem('unread')))
}
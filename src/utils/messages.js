const generateMessage=(text)=>{
    
    return {
        text:text.message,
        createdAt:new Date().getTime(),
        username:text.username
    }
}
const welcomeMessage=(text)=>{
    
    return {
        text:text,
        createdAt:new Date().getTime(),
        username:'Admin'
    }
}

const generateLocationMessage=(obj)=>{
    return {
        url:obj.url,
        createdAt:new Date().getTime(),
        username:obj.username
    }
}

module.exports={
    generateMessage,
    generateLocationMessage,
    welcomeMessage
}
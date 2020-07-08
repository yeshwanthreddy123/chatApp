const express=require('express')
const path=require('path')
const http=require('http')
const socketio=require('socket.io')
const Filter=require('bad-words')

const {generateMessage,generateLocationMessage,welcomeMessage}=require('../src/utils/messages.js')
const { adduser, getUser, getUsersInroom, removeUser}=require('../src/utils/users.js')
const app=express()
const server=http.createServer(app)
const io=socketio(server)
const PORT=process.env.PORT ||3000
const Publicpath=path.join(__dirname,'../public')

app.use(express.static(Publicpath))



io.on('connection',(socket)=>{
    
    
    
    socket.on('join',({username,room},cb)=>{
        const {error,user}=adduser({id:socket.id,username,room})

        if(error)
        {
            return cb(error)
        }

        socket.join(user.room)
        
        socket.emit('message',welcomeMessage('welcome!'))

        socket.broadcast.to(user.room).emit('message',welcomeMessage( `${user.username} has joined`))
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersInroom(user.room)
        })

        cb()
    })

   socket.on('sendMessage',(message,cb)=>{
       const filter=new Filter()
       if(filter.isProfane(message))
       {
           return cb('profanity is not allowed')
       }
       const user=getUser(socket.id)
       const username=user.username
       io.to(user.room).emit('message',generateMessage({message,username}))
       cb()
   })

   socket.on('sendLocation',(latitude,longitude,cb)=>{
    const user=getUser(socket.id)
        if(!user)
        {
            return cb('error')
        }
        const url=`http://google.com/maps?q=${latitude},${longitude}`
        const {username}=user
       io.to(user.room).emit('locationMessage',generateLocationMessage({url,username}))
       cb()
   })

   socket.on('disconnect',()=>{
       const user=removeUser(socket.id)
       if(user)
       {
         io.to(user.room).emit('message',welcomeMessage( `${user.username} has left`))
         
         io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersInroom(user.room)
        })

       }
   })

   

})


server.listen(PORT,()=>{
    console.log('Serever staring on port: '+PORT)
})
const socket=io()


const $messageForm=document.querySelector('#message-form')
const $messageFormInput=$messageForm.querySelector('input')
const $messageFormButton=$messageForm.querySelector('button')
const $messages=document.querySelector('#messages')
// const $location=document.querySelector('#location')
const $sendLocationButton=document.querySelector('#send-location')

const messageTemplate=document.querySelector('#message-template').innerHTML
const locationTemplate=document.querySelector('#location-message-template').innerHTML
const sidebarTemplate=document.querySelector('#sidebar-template').innerHTML


const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})

const autoscroll=()=>{

   const $newMessage=$messages.lastElementChild
   
   const newMessageStyle=getComputedStyle($newMessage)
   const newMessageMargin=parseInt(newMessageStyle.marginBottom)
   const newMessageHeight=$newMessage.offsetHeight


   const visibleheight=$messages.offsetHeight


   const containerHeight=$messages.scrollHeight

   const scrollOffSet=$messages.scrollTop+visibleheight

   if(containerHeight-newMessageHeight<=scrollOffSet)
   {
        $messages.scrollTop=$messages.scrollHeight
   }
}

socket.on('message',(msg)=>{
    console.log('Received message',msg)
    const html=Mustache.render(messageTemplate,{
        message:msg.text,
        createdAt:moment(msg.createdAt).format('h:mm a'),
        username:msg.username
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('locationMessage',(location)=>{
    const html=Mustache.render(locationTemplate,{
        location:location.url,
        createdAt:moment(location.createdAt).format('h:mm a'),
        username:location.username
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})



$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()

    $messageFormButton.setAttribute('disabled','disabled')
    const message=e.target.message.value
    socket.emit('sendMessage',message,(error)=>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value=''
        $messageFormInput.focus()
        if(error)
        {
        return console.log(error)
        }

        console.log("message was delivered")
    })
})

$sendLocationButton.addEventListener('click',(e)=>{
    if(!navigator.geolocation)
    {
        return alert('Your browser does not support geolocation')
    }
    $sendLocationButton.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
        
        socket.emit('sendLocation',position.coords.latitude,position.coords.longitude,()=>{
            $sendLocationButton.removeAttribute('disabled')
                console.log("location shared")
        })
    })
})


socket.emit('join',{username,room},(error)=>{
    if(error)
    {
        alert('error')
        location.href="/"
    }
})


socket.on('roomData',({room,users})=>{
    const html=Mustache.render(sidebarTemplate,{
        users,
        room
    })

    document.querySelector('#sidebar').innerHTML=html
})
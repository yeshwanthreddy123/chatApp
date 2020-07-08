const users=[]


const adduser=({id,username,room})=>{
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()
    if(!username || !room)
    {
        return {
            error:'username and room are required'
        }
    }


    const existingUser=users.filter((user)=>{
        return user.room===room && user.username===username
    })

    if(existingUser.length>0)
    {
        return {
            error:'username in use'
        }
    }

    const user={id,username,room}
    users.push(user)
    return {user}

}


const removeUser=(id)=>{
    const index=users.findIndex((user)=>user.id===id)

    if(index!==-1)
    {
        return users.splice(index,1)[0]
    }

}


const getUser=(id)=>{
    const user=users.find((user)=>user.id===id)

    if(user)
    {
        return user;
    }

}

const getUsersInroom=(room)=>{
    room=room.trim().toLowerCase()
    return users.filter((user)=>user.room===room)
   
}

module.exports={
    adduser,
    getUser,
    getUsersInroom,
    removeUser
}
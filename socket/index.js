const io = require("socket.io")(8900,{
    cors:{
        origin: "http://localhost:3000",
    },
});


let users = [];

const addUser = (userId, socketId) => {
    !users.some((user)=>user.userId == userId) && users.push({
        userId, socketId
    })
}

const removeUser = (socketId) => {
    users = users.filter((user)=>user.socketId !== socketId);
}

const getSocketId = (userId) => {

    const user = users.find((u)=>u.userId === userId);
    return user.socketId;


    
}


io.on("connection", (socket)=>{
    console.log("user connected");

    socket.on("addUser", (UserId)=>{
        addUser(UserId, socket.id)
        io.emit("getUsers", users);
    })


    socket.on("sendMessage", message => {
        console.log("Message received");
        console.log(getSocketId(message.receiverId));

        io.to(getSocketId(message.receiverId)).emit("getMessage", {
            senderId : message.senderId, 
            text: message.text
        })
    })


    socket.on("disconnect", ()=>{
        console.log("user disconnected");
        removeUser(socket.id);
        io.emit("getUsers", users);
    })
})
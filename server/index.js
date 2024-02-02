const http=require("http")
const express=require("express")
const socketIO=require("socket.io")
const cors=require("cors")
const port=4500 || process.env.PORT
const users=[{}]
const app=express()
app.use(cors())
app.get("/",(req,res)=>{
    res.send("hell its working")
})
const server=http.createServer(app)

const io=socketIO(server)
io.on("connection",(socket)=>{
    console.log("New Connection");

    socket.on('joined',({user})=>{
          users[socket.id]=user;
          console.log(`${user} has joined `);
          socket.broadcast.emit('userJoined',{user:"Admin",message:` ${users[socket.id]} has joined`});
          socket.emit('welcome',{user:"Admin",message:`Welcome to the chat,${users[socket.id]} `})
    })

    socket.on('message',({message,id,attachments})=>{
        io.emit('sendMessage',{user:users[id],message,id});
    })
    socket.on("photo",({photo,id})=>{
        socket.emit("sendPhot",{photo,id})
    })

    socket.on('disconnect',()=>{
          socket.broadcast.emit('leave',{user:"Admin",message:`${users[socket.id]}  has left`});
        console.log(`user left`);
    })
});
server.listen(port,()=>{
    console.log(`server is running on http://localhost:${port}`)
    console.log(`Working`);
})
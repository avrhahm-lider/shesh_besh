import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import { create, disconnect_room, join_room, leave_room } from "./handler/roomHandlers.js";
import { registergameEvents } from "./events/gameEvents.js";



const app = express()
const server = createServer(app)
const io = new Server(server,{
    cors:{
        origin: ["*"]
    }
})
io.on('connect', (socket)=>{
    console.log("conected");
    socket.on("create", (name)=>{
        console.log(name);
        
        create(socket, name)
    })
    socket.on("join_room", (data) =>{
        console.log(data)  
        join_room(io, socket, data.name, data.roomId)
    })
    socket.on("leave_room", (roomId)=>{
        console.log(roomId);
        
        leave_room(io, socket, roomId)
    })

    socket.on('disconnect', ()=>{
        disconnect_room(io, socket)
    })

    registergameEvents(io, socket)
})

server.listen(8000, ()=>{
    console.log("server runing on http://localhost:8000 / ws://locahost:8000");
    
})
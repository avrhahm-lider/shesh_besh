
import { rooms } from "../db/rooms_store.js"
import { isSocketInRoom } from "../utils/utils.js"

export function create(socket,name){
    if (isSocketInRoom(socket)){
        socket.emit("IoEMsg", {mssage: "player is in another room"})
        return
    }
    if (!isNaN(name) || name.length > 20){
        socket.emit("IoEMsg", {mssage: "invalid name"})
        return
    }
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    let roomId = ""
    do{
    for (let i =0; i<6; i++){
        roomId += chars[Math.floor(Math.random() *chars.length)]
    }
    }while(rooms.has(roomId))
    rooms.set(roomId, {id: roomId,
         status: 'waiting',
          ownerSocketId: socket.id,
           players:[{ socketId: socket.id, name: name, color: "white" }],
           game: null,
           rematchAcceptedBy: []
           })
    socket.join(roomId)
    socket.emit("IoSMsg", {mssage: "room open seccessfuly", roomId})
    console.log({mssage: "room open seccessfuly", roomId});    
}

export function join_room(io, socket,name, roomId){
    if (isSocketInRoom(socket)){
        socket.emit("IoEMsg", {mssage: "player is in another room"})
        return
    }
        if (name.length > 20){
        socket.emit("IoEMsg", {mssage: "invalid name"})
        return
    }
    
    if (!rooms.has(roomId)){
        socket.emit("IoEMsg", {mssage: "invalid room"})
        return
    }
    if (rooms.size > 2){
        socket.emit("IoEMsg", {mssage: "invalid room"})
        return
    }
        socket.join(roomId)
        console.log(rooms.has(roomId));
        
        console.log(rooms.get(roomId));
        rooms.get(roomId).players.push({ socketId: socket.id, name: name, color: "black" })
        
        
    io.to(roomId).emit("IoSMsg", {mssage: `${name} added to room => ${roomId}`})
}


export function leave_room(io, socket, roomId){
    if (!rooms.has(roomId)){
        socket.emit("IoEMsg", {mssage: "invalid roomId"})
        return
    }
    const playerLeave = rooms.get(roomId).players.find(val => val.socketId === socket.id)
    const roomClients = io.sockets.adapter.rooms.get(roomId);
        io.to(roomId).emit("roomClosed", {mssage: `${playerLeave.name} leave room => ${roomId}`, roomId})
    for (let socketId of roomClients){
        const playerSocket = io.sockets.sockets.get(socketId);
        playerSocket.leave(roomId)
    }
    rooms.delete(roomId)
    console.log(rooms);
    
}

export function disconnect_room(io, socket){
    let roomId = ""
    for (let k of rooms.keys()){
        if (rooms.get(k).players.some(val => val.socketId === socket.id)){
            roomId = k
            break
        }
    }
    const playerLeave = rooms.get(roomId).players.find(val => val.socketId === socket.id)
    const roomClients = io.sockets.adapter.rooms.get(roomId);
        io.to(roomId).emit("roomClosed", {mssage: `${playerLeave.name} leave room => ${roomId}`, roomId})
    for (let socketId of roomClients){
        const playerSocket = io.sockets.sockets.get(socketId);
        playerSocket.leave(roomId)
    }
    rooms.delete(roomId)
    console.log(rooms);
    
}


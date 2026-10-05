import { rooms } from "../db/rooms_store.js"

export function isSocketInRoom(socket){
    for (let k of rooms.keys()){
        if (rooms.get(k).players.some(val => val.socketId === socket.id))
            return true
    }
    return false
}
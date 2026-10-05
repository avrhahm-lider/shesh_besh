import { rolleGame, startGame } from "../handler/playHandler.js"

export function registergameEvents(io, socket){
    socket.on("game:start", (roomId)=>{
        startGame(io, roomId, socket)
    })
        socket.on("game:roll", (roomId)=>{
        rolleGame(io, socket, roomId)
    })
}
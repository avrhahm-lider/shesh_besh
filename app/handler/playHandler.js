import { getGame } from "../db/board_store.js";
import { rooms } from "../db/rooms_store.js";
import { rollDice } from "../utils/rolleDice.js";
import { isSocketInRoom } from "../utils/utils.js";

export function startGame(io, roomId, socket){
    const room = rooms.get(roomId)
    if (room.status !== 'waiting'){
        socket.emit("IoEMsg", {message: 'game is alredy stated'})
        return
    }
    if (room.ownerSocketId !== socket.id){
        socket.emit("IoEMsg", {message: 'only the woner can start tthe game'})
        return
    }
    if (!room.players.length == 2){
        socket.emit("IoEMsg", {message: 'you need tow players to start the game'})
        return
    }
    if (isSocketInRoom(socket)){
        socket.emit("IoEMsg", {message: 'you need to be conected to the room'})
    }
    const white = rollDice()
    const black = rollDice()
    rooms.get(roomId).game = getGame(white, black)
    rooms.get(roomId).status = 'playing'
     io.to(roomId).emit('IoSMsg', {message:'start Game', roolPlayers:{white, black }})

}

export function rolleGame(io, socket, roomId) {
    if(rooms.get(roomId).game.currentPlayer){}
    
    const firstDice = rollDice()
    const second = rollDice()
    const dice = [firstDice,second]
    rooms.get(roomId).game.dice = dice
    if(second === firstDice){
        rooms.get(roomId).game.remainingDice=[firstDice,firstDice,firstDice,firstDice]
    }
    else{
        rooms.get(roomId).game.remainingDice=[...dice]
    }
    io.to(roomId).emit("room:state", rooms.get(roomId))
}
export function getGame(white, black) {
    
    return {

        board: initialBoard(),

        currentPlayer: white > black ? "white": 'black',

        dice: [],

        remainingDice: [],

        bar: { white: 0, black: 0 },

        borneOff: { white: 0, black: 0 },

        status: "waiting-for-roll",

        winner: null

}
    
}
function initialBoard(){
    const board = [];
    
    for (let i = 0; i < 24; i++) {
        if (i === 0) {
            board.push({ owner: 'black', checkers: 2 });
        } 
        else if (i === 23) {
            board.push({ owner: 'white', checkers: 2 });
        } 
        else if (i === 11) {
            board.push({ owner: 'black', checkers: 5 });
        } 
        else if (i === 12) {
            board.push({ owner: 'white', checkers: 5 });
        } 
        else if (i === 16) {
            board.push({ owner: 'black', checkers: 3 });
        } 
        else if (i === 7) {
            board.push({ owner: 'white', checkers: 3 });
        } 
        else if (i === 18) {
            board.push({ owner: 'black', checkers: 5 });
        } 
        else if (i === 5) {
            board.push({ owner: 'white', checkers: 5 });
        } 
        else {
            board.push({ owner: null, checkers: 0 });
        }
    }
    
    return board;
}
const gameData = require('./game-data.js');
const EventEmitter = require('events');


//Runs the entire game flow
module.exports = class Game {
    constructor(playername, playerid) {
        this.events = new EventEmitter();
        this.players = [{name: playername, id: playerid}];
        this.state = gameData.gamestates.waiting; 
        this.statedata = {};   
    }

    subscribe(listener){
        this.events.addListener(listener);
    }

    unsubscribe(listener){
        this.events.removeListener(listener);
    }

    canJoinGame() {
        return this.players.length === 1;
    }

    //Adds a player to a game and starts the game
    joinGame(playername, playerid) {
        this.players.push({name: playername, id: playerid});
        this.state = gameData.gamestates.starting;
        this.events.emit(this);
        
        let count = 5;

        const timer = setInterval(() => {
            count--;
            this.statedata = {time: count};
            if(count === 0) {
                this.state = gameData.gamestates.building;
                clearInterval(timer);
            }
            this.events.emit(this);
        }, 1000);
    }


};
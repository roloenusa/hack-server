const gameData = require('./game-data.js');

//Runs the entire game flow
module.exports = class Game {
    constructor(socket, playername, playerid) {
        //Anything in private will be exluded from json output
        this.connections = [socket];
        this.players = [{name: playername, id: playerid}];
        this.state = gameData.gamestates.waiting; 
        this.statedata = {};
        this._stateChanged();   
    }

    canJoinGame() {
        return this.players.length === 1;
    }

    _stateChanged(){
        const state = JSON.stringify(this, function(key, value){
            if(key === 'connections') return undefined;
            else return value;
        });

        for(let i = 0; i < this.players.length; i++) {
            const player = this.players[i];
            const connection = this.connections[i];

            console.log('sending state', {player: player, gamedata: state});
            connection.send(state);
        }
    }

    //Adds a player to a game and starts the game
    joinGame(socket, playername, playerid) {
        this.connections.push(socket);
        this.players.push({name: playername, id: playerid});
        this.state = gameData.gamestates.starting;
        this._stateChanged();
        
        //Starts a countdown
        let count = 5;
        this.statedata = {time: count};
        this._stateChanged();

        const timer = setInterval(() => {
            count--;
            this.statedata = {time: count};
            if(count === 0) {
                this.state = gameData.gamestates.building;
                clearInterval(timer);
            }
            this._stateChanged();
        }, 1000);
    }


};
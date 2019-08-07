const gameData = require('./game-data.js');
const character = require('./character.js');
const CHARACTER_LIMIT = 4;

//Runs the entire game flow
module.exports = class Game {
    constructor(socket, playername, playerid) {
        this.players = [];
        this.connections = [];
        this._addPlayer(socket, {name: playername, id: playerid});
        this.state = gameData.gamestates.waiting; 
        this.statedata = {};
        this.totalCharacters = 0;
        this._stateChanged();   
    }

    canJoinGame() {
        return this.players.length === 1;
    }

    _stateChanged(){
        for(let i = 0; i < this.players.length; i++) {
            const player = this.players[i];
            const connection = this.connections[i];

            const state = JSON.stringify({player: player, gamedata: this}, function(key, value){
                if(key === 'connections') return undefined;
                else return value;
            });

            console.log('sending state', state);
            connection.send(state);
        }
    }

    _addPlayer(socket, player){
        player.characters = [];
        if(!player.name) player.name = "Player" + player.id;
        this.connections.push(socket);
        this.players.push(player);
       
        ws.on('message', function(msg) {
            try {
                const data = JSON.parse(msg);
                if(data.type === 'character') this._addCharacter(
                  this._getOpponent(player), 
                  data.icon, 
                  data.strength, 
                  data.weakness, 
                  data.element
                );
            } catch(err) {
              //Do not respond to invalid json
              console.log('invalid json message', err);
            }
        });
    }

    _getOpponent(player){
        for(let i = 0; i < this.players.length; i++){
            if(this.players[i] !== player) return this.players[i];
        }
        return null;
    }

    _addCharacter(player, icon, strength, weakness, element){
        //Dissallow more than the max characters per side
        if(player.characters.length === CHARACTER_LIMIT) return;

        const name = 'Character ' + player.characters.length;
        const id = playr.id + '-' + player.characters.length;
        const character = new Character(name, id, icon, [strength, weakness], element);
        player.characters.push(character);
        this.totalCharacters++;
        
        this.statedata = {};
        this._stateChanged();

        //Start the battle waiting after 5 seconds
        if(this.totalCharacters === CHARACTER_LIMIT * 2) {
            setTimeout(() => {
                this._battleStarting();
            }, 5000);
        }
    }

    //Start battle waiting countdown
    _battleStarting(){
        this.state = gameData.gamestates.battlestarting;
        let count = 5;
        this.statedata = {time: count};
        this._stateChanged();

        const timer = setInterval(() => {
            count--;

            this.statedata = {time: count};
            if(count === 0) {
                setTimeout(() => {
                    this._startBattle();
                }, 2000);
                clearInterval(timer);
            }
            this._stateChanged();
        }, 1000);
    }

    //Start the battle
    _startBattle(){
        this.state = gameData.gamestates.battle;
        this._stateChanged();
        
        //TODO run the battle
    }   

    //Adds a player to a game and starts the game
    joinGame(socket, playername, playerid) {
        this._addPlayer(socket, {name: playername, id: playerid});

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
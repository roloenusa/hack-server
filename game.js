const gameData = require('./game-data.js');
const Character = require('./character.js');
const characterNames = require('./character-names');

const CHARACTER_LIMIT = 4;
const BATTLE_TICK = 50;
const WAITING_TIME = 5000;
const TRANSITION_DELAY = 2000;

//Runs the entire game flow
module.exports = class Game {
    constructor(socket, playername, playerid) {
        this.players = [];
        this.connections = [];
        this.tick = null;
        this.finishedHandler = null;
        this._addPlayer(socket, {name: playername, id: playerid});
        this.state = gameData.gamestates.waiting; 
        this.statedata = {};
        this.totalCharacters = 0;
        this.poolNames = characterNames.getNames();
        this._stateChanged();   
    }

    canJoinGame() {
        return this.players.length === 1;
    }

    _stateChanged(){
        for(let i = 0; i < this.players.length; i++) {
            const player = this.players[i];
            const connection = this.connections[i];

            const state = JSON.stringify({player: player, opponent: this._getOpponent(player), gamedata: this}, function(key, value){
                if(key === 'connections' || key === 'tick' || key === 'finishedHandler' || key === 'players') return undefined;
                else return value;
            });

            connection.send(state);
        }
    }

    _addPlayer(socket, player){
        player.characters = [];
        if(!player.name) player.name = "Player" + player.id;
        this.connections.push(socket);
        this.players.push(player);
       
        socket.on('message', (msg) => {
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

        // const name = 'Character ' + player.characters.length;
        const id = player.id + '-' + player.characters.length;
        const character = new Character(characterNames.getPrefix() + " " + this.poolNames.pop(), id, icon, strength, weakness, element);
        player.characters.push(character);
        this.totalCharacters++;
        
        this.statedata = {};
        this._stateChanged();

        //If the player is a bot add a character to the opponent
        if(player.isBot) {
            setTimeout(()=>{
                this._addCharacter(this._getOpponent(player), icon, strength, weakness, element);
            }, 1000);
        }

        //Start the battle waiting after 5 seconds
        if(this.totalCharacters === CHARACTER_LIMIT * 2) {
            setTimeout(() => {
                this._battleStarting();
            }, TRANSITION_DELAY);
        }
    }

    //Start battle waiting countdown
    _battleStarting(){
        this.state = gameData.gamestates.battlestarting;
        let count = WAITING_TIME / 1000;
        this.statedata = {time: count};
        this._stateChanged();

        const timer = setInterval(() => {
            count--;

            this.statedata = {time: count};
            if(count === 0) {
                setTimeout(() => {
                    this._startBattle();
                }, TRANSITION_DELAY);
                clearInterval(timer);
            }
            this._stateChanged();
        }, 1000);
    }

    //Start the battle
    _startBattle(){
        this.state = gameData.gamestates.battle;
        this._stateChanged();
        this.tick = setInterval(() => {this._battleTick()}, BATTLE_TICK);
    }
    
    _getAliveCharacters(characters){
        const alive = [];

        for(let i = 0; i < characters.length; i++) {
            if(characters[i].alive) alive.push(characters[i]);
        }

        return alive;
    }

    _battleTick(){
        console.log(`Battle tick on players: ${this.players.length}`);
        const events = [];
        const winners = [];

        for(let i = 0; i < this.players.length; i++) {
            console.log(`Battle tick: ${this.players[i].name}`);
            const playerCharacters = this.players[i].characters;
            const enemyCharacters = this._getAliveCharacters(this._getOpponent(this.players[i]).characters);
            
            if(enemyCharacters.length === 0)
            { 
                winners.push(this.players[i].id);
                continue;
            }

            for(let l = 0; l < playerCharacters.length; l++) {
                const tickEvents = playerCharacters[l]._tick(enemyCharacters, BATTLE_TICK);

                for(let k = 0; k < tickEvents.length; k++) {
                    events.push(tickEvents[k]);
                }
            }
        }

        console.log(events);
        for (let i = 0; i < this.players.length; i++) {
          for (let l = 0; l < this.players[i].characters.length; l++) {
            console.log(`player: ${this.players[i].name}, hp: ${this.players[i].characters[l].hp}`);
          }
        }

        console.log(`winners: ${winners.length}`);
        if(winners.length > 0) {
            clearTimeout(this.tick);

            setTimeout(() => {
                console.log('=== winner found');
                this.statedata = {winners: winners};
                this.state = gameData.gamestates.end;
                this._stateChanged();
                this._cleanup();
            },TRANSITION_DELAY);
        }

        if (events.length > 0) {
            this.statedata = {events: events};
            this._stateChanged();
        }


    }

    //Cleans up websocket connections and alerts the finishHandler so it can clean up anything
    _cleanup(){
        //Call finished handler if there is one
        if (typeof this.finishedHandler === 'function') this.finishedHandler();

        //Stop listening to websockets
        for(let i = 0; i < this.connections.length; i++) {
            this.connections[i].removeAllListeners();
        }
    }

    //Adds a player to a game and starts the game
    joinGame(socket, playername, playerid, isBot) {
        this._addPlayer(socket, {name: playername, id: playerid, isBot: isBot});

        this.state = gameData.gamestates.starting;
        this._stateChanged();
        
        //Starts a countdown
        let count = WAITING_TIME / 1000;
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

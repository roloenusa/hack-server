var cors = require('cors')
const express = require('express');
const app = express();
const expressWs = require('express-ws')(app);
const gameData = require('./game-data.js');
const game = require('./game.js');
const character = require('./character.js');

/**
 * Middlewares
 */
app.use(cors());
app.use((req, res, next) => {
  var red = '\033[0;32m'
  var nc = '\033[0m'
  console.log(`[${new Date().toLocaleString()}][${red}${req.method}${nc}] => ${req.originalUrl}`);
  next(); // Call the next piece of middleware.
});

app.use(express.static('public'));

/**
 * Game routes
 */

const games = [];
let uuid = 0;

app.ws('/', function(ws, req) {
  ws.on('message', function(msg) {
    try {
      const data = JSON.parse(msg);
      if(data.type === 'join'){ 
        const game = joinGame(ws, data);
        game.finishedHandler = () => {
          //TODO remove the game if we want;
        }
      }
    } catch(err) {
      //Do not respond to invalid json
      console.log('invalid json message', err);
    }
  });
});

//Creates a user id and joins a game or creates a new game if there are none to join
const joinGame = function(client, data) {
    const userid = uuid++;

    //Find an open game
    for(let i = 0; i < games.length; i++) {
      if(games[i].canJoinGame()){
        games[i].joinGame(client, data.username, userid);
        return games[i];
      }
    }

    //No open games, lets create one
    const g = new game(client, data.username, userid);
    games.push(g);
    return g;
}


app.get('/gamedata', (req, res) => {
  res.json(gameData);
});

/**
 * Test Routes
 */

app.ws('/test', function(ws, req) {
  ws.on('message', function(msg) {
    console.log(`${req.originalUrl}: ${msg}`)
    expressWs.getWss().clients.forEach(client => {
      client.send(msg); 
    })
  });
});

app.get('/charactertest', (req, res) => {
  const c1 = new character('Character 1', 'p1c1', '', [gameData.strengths[0], gameData.weaknesses[0]], 'Earth');
  const c2 = new character('Character 2', 'p2c2', '', [gameData.strengths[1], gameData.weaknesses[1]], 'Water');
  res.json({
    character1: c1,
    character2: c2,
    sampleAttack: c1.sendAttack(c2)
  });
});

/**
 * Start
 */

 // Starting on port 3001 since create-react-app wants to start on 3000
const port = process.env.PORT || 3001;
app.listen(port, () => 
  console.log(`Express server is running on port: ${port}...`)
)

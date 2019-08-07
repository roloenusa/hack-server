var cors = require('cors')
const express = require('express');
const expressWs = require('express-ws');

const app = express();
const gameData = require('./game-data.js');
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

/**
 * Routes
 */
app.get('/', (req, res) => {
  res.json([
    { id: 1, username: 'alpha'},
    { id: 2, username: "beta"}
  ]);
});

app.get('/gamedata', (req, res) => {
  res.json(gameData);
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

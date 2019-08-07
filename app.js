var cors = require('cors')
const express = require('express');
const app = express();
const expressWs = require('express-ws')(app);
const gameData = require('./game-data.js');

const http = require('http');
const WebSocket = require('ws');

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

// const server = http.createServer(app);
// const wss = new WebSocket.Server({server});

// wss.on('connection', (ws) => {
//   console.log("connection");
//   //connection is up, let's add a simple simple event
//   ws.onmessage((message) => {

//       //log the received message and send it back to the client
//       console.log('received: %s', message);
//       ws.send(`Hello, you sent -> ${message}`);
//   });

//   //send immediatly a feedback to the incoming connection    
//   ws.send('Hi there, I am a WebSocket server');
// });


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

const typesDef = {
  USER_EVENT: "userevent",
  CONTENT_CHANGE: "contentchange"
}

let editorContent = null;
let userActivity = [];

app.ws('/', function(ws, req) {
  console.log("on connected");
  ws.on('message', function(msg) {
    console.log(`${req.originalUrl}: ${msg}`)
    var message = handleMessage(msg);
    expressWs.getWss().clients.forEach(client => {
      client.send(message);
    })
  });
});

app.ws('/test', function(ws, req) {
  ws.on('message', function(msg) {
    console.log(`${req.originalUrl}: ${msg}`)
    expressWs.getWss().clients.forEach(client => {
      client.send(msg);
    })
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

const getUniqueID = () => {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return s4() + s4() + '-' + s4();
};


function handleMessage(msg) {
  const dataFromClient = JSON.parse(msg);
  const json = { type: dataFromClient.type };
  if (dataFromClient.type === typesDef.USER_EVENT) {
    users[userID] = dataFromClient;
    userActivity.push(`${dataFromClient.username} joined to edit the document`);
    json.data = { users, userActivity };
  } else if (dataFromClient.type === typesDef.CONTENT_CHANGE) {
    editorContent = dataFromClient.content;
    json.data = { editorContent: editorContent, userActivity: userActivity };
  }
  var response = JSON.stringify(json);
  console.log(response);
  return response;
}

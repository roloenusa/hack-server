import Styled from 'styled-components';
import React from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import Editor from 'react-medium-editor';


import Identicon from 'react-identicons';
import {
  Navbar,
  NavbarBrand,
  UncontrolledTooltip
} from 'reactstrap';
// import 'medium-editor/dist/css/medium-editor.css';
// import 'medium-editor/dist/css/themes/default.css';



import { w3cwebsocket as W3CWebSocket } from "websocket";

const client = new W3CWebSocket('ws://127.0.0.1:3001');
const client2 = new W3CWebSocket('ws://127.0.0.1:3001/test');
const contentDefaultMessage = "Start writing your document here";

const Container = Styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`;

const Button = Styled.button`
`;

const H1 = Styled.h1`
`;

const Input = Styled.input`
`;


@observer
class App extends React.Component {
  @observable game = null
  @observable users = []
  @observable gameState = {};

  gameData = {}

  componentWillMount() {
    fetch("http://localhost:3001/gamedata")
    .then(res => res.json())
    .then((result) => {
        this.gameData = result;
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (error) => {
        throw error;
      }
    )
    .then
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };

    client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      this.setGameData(dataFromServer); 
    };
  }

  @action setUsername = (event) => {
    this.username = event.target.value.trim();
  }

  @action findBattle = () => {
    client.send(JSON.stringify({
      username: this.username,
      type: 'join'
    }));
  }

  @action setGameData = (data) => {
    this.gameState = data
  }

  findBattleUI = () => {
    return (
    <Button onClick={this.findBattle} className="btn btn-primary">
      Find a battle
    </Button>
    );
  }

  waitingBattleUI = () => {
    return (
      <h1>Waiting...</h1>
    );
  }

  countdownBattleUI = () => {
    return (
      <h1>Join... {this.gameState.gamedata.statedata.time}</h1>
    );
  }

  renderGameState = () => {
    if (!this.gameState.gamedata) {
      return this.findBattleUI()
    } else if (this.gameState.gamedata.state === 0) {
      return this.waitingBattleUI();
    } else if (this.gameState.gamedata.state === 1) {
      return this.countdownBattleUI();
    }
  }

  render() {
    const username = this.username;
    return (
      <Container className="container d-flex h-100 flex-column">
        <React.Fragment>
          <div className="row flex-fill">
            <div className="col align-self-center content">
              <H1>
                Collabwar
              </H1>
              <div>
                <input placeholder="enter a username" onChange={this.setUsername}/>
              </div>
              <div>
              {
                this.renderGameState()
              }
              </div>
            </div>
          </div>
        </React.Fragment>
      </Container>
    );
  }
}

export default App;

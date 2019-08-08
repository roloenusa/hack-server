import Styled from 'styled-components';
import React from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import Editor from 'react-medium-editor';
import FindBattleScreen from './screens/FindBattleScreen';
import FindingBattleScreen from './screens/FindingBattleScreen';
import VsScreen from './screens/VsScreen';
import CharacterCreationScreen from './screens/CharacterCreationScreen';


import Identicon from 'react-identicons';
import {
  Navbar,
  NavbarBrand,
  UncontrolledTooltip
} from 'reactstrap';
// import 'medium-editor/dist/css/medium-editor.css';
// import 'medium-editor/dist/css/themes/default.css';



import { w3cwebsocket as W3CWebSocket } from "websocket";
import { thisExpression } from '@babel/types';

let url = process.env.NODE_ENV == 'production' ? "p1hack.herokuapp.com" : localhost;
let port = process.env.PORT || 3001;
let endpoint = `ws://${url}:${port}`
// const client = new W3CWebSocket(`ws://${endpoint}`);
const client = new W3CWebSocket(`ws://${endpoint}/charactercreation`);
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
  @observable game = null;
  @observable users = [];
  @observable gameState = {};
  @observable gameData = {};

  componentWillMount() {
    fetch("http://localhost:3001/gamedata")
    .then(res => res.json())
    .then((result) => {
        console.log(result);
        this.setGameData(result);
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
      this.setGameState(dataFromServer); 
    };
  }

  @action setUsername = (event) => {
    this.username = event.target.value.trim();
  }

  @action onFindBattle = (username) => {
    client.send(JSON.stringify({
      username: username,
      type: 'join'
    }));
  }

  @action setGameState = (data) => {
    this.gameState = data
  }

  @action setGameData = (data) => {
    this.gameData = data
  }

  findBattleUI = () => {
    return (
      <div>
        <H1>
          Collabwar
        </H1>
        <div>
          <input className="form-control form-control-lg" placeholder="enter a username" onChange={this.setUsername}/>
        </div>
        <Button onClick={this.findBattle} className="btn btn-primary">
          Find a battle
        </Button>
      </div>
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

  lockCharacter = (character) => {
    client.send(JSON.stringify(character));
  }

  render() {
    if (!this.gameState.gamedata) {
      return <FindBattleScreen onFindBattle={this.onFindBattle} />
    } else if (this.gameState.gamedata.state === 0) {
      return <FindingBattleScreen />
    } else if (this.gameState.gamedata.state === 1) {
      return <VsScreen playerName={this.gameState.player.name} opponentName={this.gameState.opponent.name} text="Building starts in" count={this.gameState.gamedata.statedata.time} />
    } else if (this.gameState.gamedata.state === 2) {
      return <CharacterCreationScreen gameData={this.gameData} lockCharacter={this.lockCharacter} gameState={this.gameState} />
    }
    return <div>hello</div>
  }
}

export default App;

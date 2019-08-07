import Styled from 'styled-components';
import React from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import Editor from 'react-medium-editor';
import FindBattleScreen from './screens/FindBattleScreen';
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

  @action findBattle = () => {
    client.send(JSON.stringify({
      username: this.username,
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

  createCharacterUI = () => {
    if (this.gameData.strengths) {
      return (
        <div className="row">
          <div className="col">
            <CharacterCreationScreen gameData={this.gameData} lockCharacter={this.lockCharacter} />
          </div>

          <div className="col">
            <h2>Your Team</h2>
            {
              !this.gameState.player ? '' : this.gameState.player.characters.map((e) => {
                <div className="row">
                  <div className="col-3">
                    <img src={"http://localhost:3001/img/characters/" + e.icon + ".png"} />
                  </div>
                  <div className="col-3">
                    <div>THE ELEMENT</div>
                    <div>THE NAME</div>
                    <div>THE STRENGTH</div>
                    <div>THE THE WEAKNESS</div>
                  </div>
                </div>
              })
            }
          </div>

          <div className="col">
            <h2>{"BLAH"}'s Team</h2>
          </div>
        </div>
      );
    }
  }

  lockCharacter = (character) => {
    client.send(JSON.stringify(character));
  }

  renderGameState = () => {
    if (!this.gameState.gamedata) {
      return <FindBattleScreen />
    } else if (this.gameState.gamedata.state === 0) {
      return this.waitingBattleUI();
    } else if (this.gameState.gamedata.state === 1) {
      return this.countdownBattleUI();
    } else if (this.gameState.gamedata.state === 2) {
      return this.createCharacterUI();
    }
  }

  render() {
    const username = this.username;
    return (
      <Container className="container d-flex h-100 flex-column">
        <React.Fragment>
          <div className="row flex-fill">
            <div className="col align-self-center content">
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

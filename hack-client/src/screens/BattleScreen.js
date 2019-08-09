import Styled from 'styled-components';
import React from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import BattleCharacter from '../components/BattleCharacter'; 

const Container = Styled.div`
  display: flex;
  position: fixed;
  top:0;
  left:0;
  right:0;
  bottom:0;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: center;
  background-image: url(http://localhost:3001/img/battle-scene.jpg);
  background-position: center;
  background-size: cover;
`;

const BattleArea = Styled.div`
  width: 800px;
  margin: 0 auto;
  height: 100%;
  display: flex;
`;

const Col = Styled.div`
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
`;

@observer
class BattleScreen extends React.Component {
  componentDidUpdate() {
    let gameState = this.props.gameState;

    if (gameState.gamedata.statedata.events) {
      for (let i = 0; i < gameState.gamedata.statedata.events.length; i++) {
        let event = gameState.gamedata.statedata.events[i];
        if (event.type === 'bleed') {
          showBleed('c' + event.to);
        } else if (event.type ==='regen') {
          showRegen('c' + event.to);
        } else if (event.type ==='atk') {
          shootBullet('c' + event.from, 'c' + event.to, event.didCrit);
        }
      }
    }
  }

  render() {
    const {gameState} = this.props;
    return (<Container>
      <BattleArea>
      <Col>
      {
            gameState.player.characters.map((e) => {
              return (
                <div id={'c' + e.id}>
                  <BattleCharacter character={e} key={e.id} />
                </div>
              )
            })
      }
      </Col>
      <Col>
      {
            gameState.opponent.characters.map((e) => {
              return (
                <div id={'c' + e.id}>
                  <BattleCharacter character={e} key={e.id} alignRight={true} id={e.id} />
                </div>
              )
            })
      }
      </Col>
      </BattleArea>
    </Container>)
  }
}

export default BattleScreen;

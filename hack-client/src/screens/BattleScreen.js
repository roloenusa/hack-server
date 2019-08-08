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
  render() {
    const {gameState} = this.props;
    return (<Container>
      <BattleArea>
      <Col>
      {
            gameState.player.characters.map((e) => {
              return (
                <BattleCharacter character={e} key={e.id} />
              )
            })
      }
      </Col>
      <Col>
      {
            gameState.opponent.characters.map((e) => {
              return (
                <BattleCharacter character={e} key={e.id} alignRight={true} />
              )
            })
      }
      </Col>
      </BattleArea>
    </Container>)
  }
}

export default BattleScreen;

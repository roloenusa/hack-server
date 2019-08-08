import Styled from 'styled-components';
import React from 'react';

const Container = Styled.div`
  display:flex;
  align-items:center;
  justify-content: space-between;
  flex-direction: column;
  width: 150px;
  height: 150px;
`;

const Icon = Styled.div`
  width: 30%;
  flex-grow: 0,
  flex-shrink: 0;
  background-image: url(http://localhost:3001/img/characters/12.png);
  height: 125px;
  width: 125px;
  background-repeat: no-repeat;
  background-position: center;
  transform: scaleX(${props => props.flip ? "-1" : "1" });
`;

const HpBar = Styled.div`
  height: 10px;
  background-color: black;
  width:100%;
  position:relative;
`;

const Hp = Styled.div`
  position: absolute;
  height: 100%;
  background-color: green;
  top:0;
  bottom:0;
  width: ${props => props.width}%;
`;

const Name = Styled.div`
  color:white;
`;


class BattleCharacter extends React.Component {
  render() {
    const {character, alignRight} = this.props;
    
    console.log('bb',character);
    return (
      <Container>
        <HpBar><Hp width={((character.hp * 100) / character.maxhp) || 100}></Hp></HpBar>
        <Icon style={{backgroundImage: 'url(' + 'http://localhost:3001/img/characters/' + character.icon + '.png' + ')'}} flip={alignRight} />
        <Name>{character.name}</Name>
      </Container>
    )
  }
}

export default BattleCharacter;

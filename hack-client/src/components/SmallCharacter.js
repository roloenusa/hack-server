import Styled from 'styled-components';
import React from 'react';
import { observer } from 'mobx-react';
import pose from 'react-pose';
import { observable } from 'mobx';

const Box = pose.div({
  init: { opacity: 0},
  fadeIn: { 
    opacity: 1,
    transition: {
      duration: 4000,
    }
  }
});

const Container = Styled(Box)`
    text-align: center;
    width: 100%;
    margin-top: 10px;
    background-color: #3C4059;
    color: white;
    box-sizing: border-box;
    display: flex;
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
  background-color: rgb(84, 88, 113);
`;

const Overview = Styled.div`
  flex-grow: 1;
  padding: 10px 10px 10px 20px;
  text-align: left;
`;

const Element = Styled.div`
  text-transform: uppercase;
  opacity: .5;
  margin-bottom: 0;
`;

const Name = Styled.div`
  font-size: 24px;
`;

const Strength = Styled.div`
  color: #96E599;
`;

const Weakness = Styled.div`
color: #FF7070;
`;

const EmptyContainer = Styled.div`
    text-align: center;
    width: 100%;
    margin-top: 10px;
    background-color: #3C4059;
    color: white;
    box-sizing: border-box;
    display: block;
    height: 125px;
    line-height: 125px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.26);
`;

const numericStrings = {
  0 : 'First',
  1 : 'Second',
  2 : 'Third',
  3: 'Fourth'
}



@observer
class SmallCharacter extends React.Component {
  @observable pose = 'init';

  loadPose() {
    if (this.pose == 'fadeIn') return;

    setTimeout(() => {
      this.pose = 'fadeIn';
    }, 100)
  }

  render() {
    const {character, alignRight,index} = this.props;
    
    if(!character){
      return (
        <EmptyContainer>{numericStrings[index]} character</EmptyContainer>
      )
    }

    const icon = <Icon style={{backgroundImage: 'url(' + 'http://localhost:3001/img/characters/' + character.icon + '.png' + ')'}} />
    const left = alignRight ? null : icon;
    const right = alignRight ? icon : null;
    this.loadPose();
    return (
      <Container pose={this.pose}>
            {left}
            <Overview>
            <Element>{character.element}</Element>
            <Name>{character.name}</Name>
            <Strength>{character.strength.title}</Strength>
            <Weakness>{character.weakness.title}</Weakness>
            </Overview>
            {right}
      </Container>
    )
  }
}

export default SmallCharacter;

import Styled from 'styled-components';
import React from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import Bar from '../components/Bar';
import Button from '../components/Button';

const Container = Styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: center;
`;

const Header = Styled.div`
  font-size: 60px;
  color: #FA9B64;
  font-family: 'Rock Salt', cursive;
`;

const Content = Styled.div`
  width: 350px;
  padding-top: 100px;
  padding-bottom: 100px;
  margin: 0 auto;
`;

const Vs = Styled.div`
  font-size: 140px;
  color: #FA9B64;
  font-family: 'Rock Salt', cursive;
  font-weight: bold;
  letter-spacing: 15px;
`;

const Player = Styled.div`
  font-size: 45px;
  color: white;
  text-transform: uppercase;
`;

const Timer = Styled.div`
  display: flex;
  flex-direction: row;
  margin: 0 auto;
  padding-top: 90px
`;

const Text = Styled.div`
  margin-right: 15px;
  width: 150px;
  text-align: right;
  font-size: 25px;
  color: rgba(255, 255, 255, 0.47);
  text-transform:uppercase;
`;

const Count = Styled.div`
  font-size: 75px;
  line-height: 50px;
  width: 133px;
`;

@observer
class FindBattleScreen extends React.Component {
  @observable username = ''
  @observable error = false

  handleClick = () => {
    if(this.username === '') return this.error = true;
    this.props.onFindBattle(this.username);
  }

  @action handleUsernameChange = (event) => {
    this.username = event.target.value;
  }

  render() {
    const {playerName,opponentName,text,count} = this.props;
    return (<Container>
      <Bar><Player>{playerName}</Player><Vs>VS</Vs><Player>{opponentName}</Player></Bar>
        <Timer>
          <Text>{text}</Text>
          <Count>{count}</Count>
        </Timer>
    </Container>)
  }
}

export default FindBattleScreen;

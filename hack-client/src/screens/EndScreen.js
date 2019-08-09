import Styled from 'styled-components';
import React from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import Bar from '../components/Bar';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import BattleCharacter from '../components/BattleCharacter';

const Container = Styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: center;
`;

const Result = Styled.div`
  font-size: 75px;
  font-family: 'Rock Salt', cursive;
`;

const Header = Styled.div`
  font-size: 30px;
  text-transform:uppercase;
  text-align: center;
  width: 100%;
`;

const Content = Styled.div`
  width: 100%;
  padding-top: 50px;
  padding-bottom: 50px;
  display: flex;
  justify-content: space-around;
`;

@observer
class EndScreen extends React.Component {
  render() {
    const {won,draw,opponent,characters} = this.props;
    let title = '';
    let result = '';
    let color = '';

    if(draw) {
      title = 'Nobody won';
      result = 'Draw';
      color = '#3C4059';
    } else if(won) {
      title='You defeated ' + opponent + '!';
      result='Victory';
      color = '#85D072';
    } else {
      title = opponent + ' defeated you!';
      result = 'Defeat';
      color = '#FF7070';
    }

    const status = 'Victory';

    return (<Container>
      <Header>{title}</Header>
      <Bar color={color}><Result>{result}</Result></Bar>
      <Content>
      {
            characters.map((e) => {
              return (
                  <BattleCharacter noHp={true} character={e} key={e.id} id={e.id} />
              )
            })
      }
      </Content>
    </Container>)
  }
}

export default EndScreen;

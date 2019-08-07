import Styled from 'styled-components';
import React from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';

const Container = Styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
`;

const Bar = Styled.div`
    text-align: center;
    background-color: #3C4059;
    height: 100px;
    width: 100%;
    margin-top: 200px;
    margin-bottom: 200px;
    padding: 15px;
`;

const Header = Styled.span`
  font-size: 40px;
  color: #FA9B64;
  font-family: 'Rock Salt', cursive;
`;

const Vs = Styled.span`
  font-size: 120px;
  color: #FA9B64;
  font-family: 'Rock Salt', cursive;
`;

@observer
class FindBattleScreen extends React.Component {
  render() {
    const {state, gamedata} = this.props;
    return (<Container>
      <Bar><Header>Collabawar Max</Header></Bar>
    </Container>)
  }
}

export default FindBattleScreen;

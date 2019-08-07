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
  font-size: 40px;
  color: rgba(255, 255, 255, 0.47);

  text-transform:uppercase;
  letter-spacing: 4px;
`;

@observer
class FindingBattleScreen extends React.Component {
  render() {
    return (<Container>
      <Bar><Header>Finding an Opponent</Header></Bar>
    </Container>)
  }
}

export default FindingBattleScreen;

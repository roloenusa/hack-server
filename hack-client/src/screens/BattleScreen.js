import Styled from 'styled-components';
import React from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';

const Container = Styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: center;
`;

@observer
class BattleScreen extends React.Component {
  render() {
    return (<Container>
      Battling!
    </Container>)
  }
}

export default BattleScreen;

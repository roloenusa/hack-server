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

const Vs = Styled.span`
  font-size: 120px;
  color: #FA9B64;
  font-family: 'Rock Salt', cursive;
`;

const TextInput = Styled.input`
  font-size: 20px;
  padding: 15px;
  width: 100%;
`;

const Error = Styled.p`
  color: #FF7070;
  font-size: 16px;
  text-align:center;
  margin-top: 10px;
  margin-bottom: 0;
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
    const {onFindBattle} = this.props;
    let error = this.error ? <Error>Please enter a username you troll</Error> : null;
    return (<Container>
      <Bar><Header>Office Battle Max</Header></Bar>
      <Content>
        <TextInput type="text" placeholder="Enter a username" value={this.username} onChange={this.handleUsernameChange}></TextInput>
        {error}
        <Button handleClick={this.handleClick}>Find a Battle</Button>
      </Content>
    </Container>)
  }
}

export default FindBattleScreen;

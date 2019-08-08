import Styled from 'styled-components';
import React from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import Bar from '../components/Bar';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import Select from '../components/Select';
import SmallCharacter from '../components/SmallCharacter'; 

const Container = Styled.div`
  display: flex;
`;

const Col = Styled.div`
  width: 33.3%;
`;

const Form = Styled.div`
  background-color: #3c4059;
  margin: 30px 50px 30px 30px;
  padding: 25px;
  min-height: 800px;
`;

const Characters = Styled.div`
  margin: 30px 30px 30px 30px;
`;

const Header = Styled.div`
  font-size: 20px;
  margin-bottom: 20px;
`;

const SmallHeader = Styled.div`
  font-size: 18px;
  margin-bottom: 20px;
  color: rgba(255, 255, 255, 0.44);
`;

const Waiting = Styled.div`
  font-size: 18px;
  margin-bottom: 20px;
  color: rgba(255, 255, 255, 0.44);
  margin-top: 50px;
  text-align:center;
`;

const Icons = Styled.div`
  display: grid; 
  grid-template-columns: 1fr 1fr 1fr 1fr; 
  grid-template-rows: 1fr 1fr; 
  grid-column-gap: 19px;
  grid-row-gap: 21px; 
`;

const Icon = Styled.div`
  padding-bottom: 80%;
  background-repeat: no-repeat;
  background-position: center top;
  cursor: pointer;
  background-size: contain;

  background-color: ${props => props.selected ? "rgb(49, 125, 240)" : "rgba(0, 0, 0, 0.21)" };

  &:hover{
    background-color: ${props => props.selected ? "rgb(49, 125, 240)" : "rgba(0, 0, 0, 0.41)" };
  }
`;

const Error = Styled.p`
  color: #FF7070;
  font-size: 16px;
  text-align:center;
  margin-top: 10px;
  margin-bottom: 0;
`;

const numericStrings = {
  0 : 'first',
  1 : 'second',
  2 : 'third',
  3: 'fourth'
}

const maxCharacters = 4;

@observer
class CharacterCreationScreen extends React.Component {
  @observable currentCharacter = {}
  @observable strength = '';
  @observable weakness = '';
  @observable element = '';
  @observable error = false;
  @observable icon = null;

  @action setStrength = (event) => {
    this.strength = event.target.value;
  }
  @action setWeakness = (event) => { 
    this.weakness = event.target.value;
  }
  @action setElement = (event) => {
    this.element = event.target.value;
  }
  @action setIcon = (icon) => {
    this.icon = icon;
  }

  @action handleClick = () => {

    if(this.strength === '') return this.error = "Please select a character strength";
    if(this.weakness === '') return this.error = "Please select a character weakness";
    if(this.element === '') return this.error = "Please select a character element";
    if(this.icon === null) return this.error = "Please select a character icon";

    this.props.lockCharacter(
      {
        type: 'character',
        strength: this.props.gameData.strengths[this.strength],
        weakness: this.props.gameData.weaknesses[this.weakness],
        element: this.props.gameData.elements[this.element].title,
        icon: this.icon,
      }
    );

    this.error = false;
    this.strength = '';
    this.weakness = '';
    this.element = '';
    this.icon = null;
  }

  optionsMap = (type, selectList, func) => {
    return (
    <select className="form-control form-control-lg" onChange={func}>
      <option>{type}</option>
      {
        selectList.map((e, i) => 
          <option   value={i} key={i}>{e.title}</option>
        )
      }
    </select>
    )
  }

  render() {
    const {lockCharacter, gameData, gameState} = this.props;
    const hasError = this.error ? <Error>{this.error}</Error> : null;
    let form;

    if(gameState.opponent.characters.length === maxCharacters) {
      form = (
        <Form>
          <Spinner />
          <Waiting>Please wait for the opponent to finish creating your characters.</Waiting>
        </Form>
      );
    } else {
      form = (
        <Form>
          <Header>Make your enemy's {numericStrings[gameState.opponent.characters.length]} character</Header>
          <Select value={this.strength} onChange={this.setStrength} prompt="Select a character strength" options={gameData.strengths} />
          <Select value={this.weakness} onChange={this.setWeakness} prompt="Select a character weakness" options={gameData.weaknesses} />
          <Select value={this.element} onChange={this.setElement} prompt="Select a character element" options={gameData.elements} />
          
          <SmallHeader>Pick your character image</SmallHeader>
          <Icons>
          {
            gameData.icons.map((e) => {
              return (
                <Icon selected={this.icon == e} style={{backgroundImage: 'url(' + 'http://localhost:3001/img/characters/' + e + '.png' + ')'}} onClick={() => this.setIcon(e)} key={e} />
              )
            })
          }
          </Icons>
            {hasError}
            <Button handleClick={this.handleClick} className="col-12 btn btn-primary">Lock in</Button>
        </Form>
      );
    }
    
    return (
        <Container>
          <Col>
              {form}
          </Col>

            <Col>
            <Characters>
              <Header>Your Team</Header>
              {
                Array.from({length: maxCharacters}, (item, index) => <SmallCharacter character={gameState.player.characters[index]} key={index} index={index} />)
              }
              </Characters>
            </Col>

            <Col>
              <Characters>
              <Header>{gameState.opponent.name}'s Team</Header>
              {
                Array.from({length: maxCharacters}, (item, index) => <SmallCharacter character={gameState.opponent.characters[index]} key={index} index={index} alignRight={true} />)
              }
              
              </Characters>
            </Col>
        </Container>
    )
  }
}

export default CharacterCreationScreen;

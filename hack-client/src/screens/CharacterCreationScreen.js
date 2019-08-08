import Styled from 'styled-components';
import React from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import Bar from '../components/Bar';
import Button from '../components/Button';

const Container = Styled.div`
`;

@observer
class CharacterCreationScreen extends React.Component {
  @observable currentCharacter = {}
  @observable strength = null;
  @observable weakness = null;
  @observable element = null;
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
  @action setIcon = (event) => {
    console.log(event.target.name);
    this.icon = event.target.name;
  }

  handleClick = () => {
    this.props.lockCharacter(
      {
        type: 'character',
        strength: this.gameData.strengths[this.strength],
        weakness: this.gameData.weaknesses[this.weakness],
        element: this.gameData.elements[this.element].title,
        icon: this.icon,
      }
    );

    this.strength = null;
    this.weakness = null;
    this.element = null;
    this.icon = null;
  }

  optionsMap = (type, selectList, func) => {
    return (
    <select className="form-control form-control-lg" onChange={func}>
      <option>{type}</option>
      {
        selectList.map((e, i) => 
          <option value={i}>{e.title}</option>
        )
      }
    </select>
    )
  }

  render() {
    const {lockCharacter, gameData} = this.props;
    this.gameData = gameData;
    return (
        <Container>
          <div className="row">
            <div className="col">
              <h2>Make Your Character</h2>
              <div className="char-creation">

                <div className="form-group">
                {
                  this.gameData.strengths ? this.optionsMap('strengths', this.gameData.strengths, this.setStrength) : ''
                }
                </div>
                <div className="form-group">
                {
                  this.gameData.weaknesses ? this.optionsMap('weaknesses', this.gameData.weaknesses, this.setWeakness) : ''
                }
                </div>
                <div className="form-group">
                {
                  this.gameData.elements ? this.optionsMap('elements', this.gameData.elements, this.setElement) : ''
                }
                </div>
                <div className="row">
                  <h3>Pick your character image</h3>
                  {
                    this.gameData.icons.map((e) => {
                      return (
                        <div className="col-4 char-imgs">
                          <img src={"http://localhost:3001/img/characters/" + e + ".png"} name={e} onClick={this.setIcon} />
                        </div>
                      )
                    })
                  }
                </div>

                <div className="row">
                  <Button handleClick={this.handleClick} className="col-12 btn btn-primary">Lock in</Button>
                </div>
              </div>
            </div>

            <div className="col">
              <h2>Your Team</h2>
              {
                !this.gameState.player ? '' : this.gameState.player.characters.map((e) => {
                  <div className="row">
                    <div className="col-3">
                      <img src={"http://localhost:3001/img/characters/" + e.icon + ".png"} />
                    </div>
                    <div className="col-3">
                      <div>THE ELEMENT</div>
                      <div>THE NAME</div>
                      <div>THE STRENGTH</div>
                      <div>THE THE WEAKNESS</div>
                    </div>
                  </div>
                })
              }
            </div>

            <div className="col">
              <h2>{"BLAH"}'s Team</h2>
            </div>
          </div>
        </Container>
    )
  }
}

export default CharacterCreationScreen;

import Styled from 'styled-components';
import React from 'react';

const Container = Styled.div`
    text-align: center;
    padding: 20px;
    width: 100%;
    margin-top: 10px;
    text-transform: uppercase;
    background-color: #007DF0;
    color: white;
    box-sizing: border-box;
`;

class SmallCharacter extends React.Component {
  render() {
    const {character} = this.props;
    return (
      <Container>
        <div className="row">
          <div className="col-3">
            <img src={"http://localhost:3001/img/characters/" + character.icon + ".png"} />
          </div>
          <div className="col-3">
            <div>{character.element}</div>
            <div>{character.name}</div>
            <div>{character.strength.title}</div>
            <div>{character.weakness.title}</div>
          </div>
        </div>
      </Container>
    )
  }
}

export default SmallCharacter;

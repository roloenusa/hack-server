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
    cursor: pointer;
    box-sizing: border-box;
    transition: background-color 0.5s ease;
    
    &:hover {
      background-color: #4ba9ff;
    }
`;

class Button extends React.Component {
  render() {
    const {children, handleClick} = this.props;
    return (
      <Container onClick={handleClick}>{children}</Container>
    )
  }
}

export default Button;

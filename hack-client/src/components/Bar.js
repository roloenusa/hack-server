import Styled from 'styled-components';
import React from 'react';

const Container = Styled.div`
    text-align: center;
    background-color: ${props => props.color};
    height: 150px;
    width: 100%;
    margin-top: 100px;
    margin-bottom: 100px;
    padding: 15px;
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: space-around;
`;

class Bar extends React.Component {
  render() {
    const {children, color} = this.props;
    let barColor = color ? color : '#3C4059';
    return (
      <Container color={barColor}>{children}</Container>
    )
  }
}

export default Bar;

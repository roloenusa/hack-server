import Styled from 'styled-components';
import React from 'react';

const Container = Styled.div`
    text-align: center;
    background-color: #3C4059;
    height: 100px;
    width: 100%;
    margin-top: 200px;
    margin-bottom: 200px;
    padding: 15px;
`;

class Bar extends React.Component {
  render() {
    const {children} = this.props;
    return (
      <Container>{children}</Container>
    )
  }
}

export default Bar;

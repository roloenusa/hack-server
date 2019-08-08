import Styled from 'styled-components';
import React from 'react';

const Container = Styled.select`
    margin-bottom: 15px;
`;

class Select extends React.Component {
  render() {
    const {onChange,prompt,options, value} = this.props;
    return (
    <Container value={value} className="form-control form-control-lg" onChange={onChange}>
        <option value="" disabled>{prompt}</option>
        {
        options.map((e, i) => 
            <option value={i} key={i}>{e.title}</option>
        )
        }
    </Container>
    )
  }
}

export default Select;

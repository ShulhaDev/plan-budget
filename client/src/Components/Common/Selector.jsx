import React from 'react'
import styled from 'styled-components';

const StyledSelector  = styled.select`
  background-color: transparent;
  border: none;
  color: ${props => props.color};
  font: inherit; 
  font-size: 1.15rem;
  &:active,&:focus{
    outline: none;
    text-shadow: none;
    box-shadow: 0 0 15px -2px inset silver;
    border-radius: 4px;
  }
  & option{
    color: black;
    background-color: transparent;
  }
`

const  Selector = ({value,options,color='inherit',onChange}) => {
    const opts = options.map(opt => <option key={opt} value={opt}>{opt}</option>);
    // opts.push( <option key={-1} value={-1}>...</option>);
    return  <StyledSelector color={ 'khaki'}  value={value}
                            onChange={ onChange }>
        {opts}
    </StyledSelector>
}

export default Selector
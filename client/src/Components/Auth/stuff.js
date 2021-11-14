import styled from "styled-components";

const Input = styled.input`
    margin-bottom: .3rem;
    box-shadow: ${props => props.error ? '0 0 10px -2px red' : 'default'};
`
const Link =  styled.a`
  text-decoration: none;
  text-shadow: 2px 2px 4px rgba(0,100,0,.9);
  color: lime;
  &:hover {
    text-shadow: 4px 4px 4px rgba(0,20,0,.9);
  }
`

export {Input,Link}
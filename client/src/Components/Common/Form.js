import styled from 'styled-components'

const Form = styled.form`
  display: inline-block;
  width: ${props => props.fixed ? '100%' : 'fit-content'};
`

export default Form
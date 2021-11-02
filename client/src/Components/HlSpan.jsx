import styled from "styled-components";

const HlSpan = styled.span`
  color: ${(props) => props.color || 'khaki'};
  font-size: 1.15rem;
  text-shadow: 1px 4px 4px black;
  transition: .5s;
`
export default HlSpan;
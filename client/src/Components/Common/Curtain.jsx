import styled from 'styled-components'

const Curtain = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  background: rgba(20,20,20,.6);
  box-shadow: 0 0 100px 50px;
  & > div {
    margin: 4rem auto;
  }
`

export default Curtain
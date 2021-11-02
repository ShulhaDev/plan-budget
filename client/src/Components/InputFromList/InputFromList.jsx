import React from "react";
import Options from "../Common/Options";
import Cleaner from "../Common/Cleaner";
import styled from "styled-components"

const Input = styled.input`
    //width: 20rem;
`

const InputFromList = ({id,caption,value='',options, update = () => {},color="inherit"})  => {
    return <span>
        <span> {caption}<Input type="text"
                             list={id + '_opts'}
                             value={value}
                             onChange={e => update(e.target.value)}/>
                      <Cleaner action={() => update("")}/> </span>
        <Options id={id + '_opts'} list={options}/>
    </span>
}

export default InputFromList;
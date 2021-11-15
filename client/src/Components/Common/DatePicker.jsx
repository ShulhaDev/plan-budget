import React, {useState} from "react";
import {currentDate} from "../../utils/utils";
import Form from "./Form";
import Btn from "./Btn";
import styled from "styled-components";

const DateI = styled.input`
	margin-left: .5rem;
	width: calc(10.7rem);
`

const DatePicker = ({value,update,caption}) => {
    const [sValue,setSValue] = useState(value || currentDate());
    return <div style={{margin: ".2rem .5rem", width: "auto"}}>
        <span>{caption}</span>
        <Form onSubmit={e => e.preventDefault() || (update && update(sValue))}>
            <DateI type={"date"} value={sValue} onChange={e => setSValue(e.target.value)}/>
            <Btn type={"submit"}>➧</Btn>
        </Form>
    </div>
}
export default DatePicker;



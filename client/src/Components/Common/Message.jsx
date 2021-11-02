import React,{useState,useRef,useEffect} from "react";
import styled from 'styled-components'
import Btn from "./Btn";

const messageTypes = {
    info: "info", error: "error", warning: "warning", confirm: "confirm"
}

const Box = styled.div`
  color: white;
  
`

const MessageBox = ({onClick,children}) => {
    return <div onClick={onClick}>
        {children}
    </div>
}

const ConfirmBox = ({text,action}) => {
    return <MessageBox>
        {text}
        <div>

        </div>
    </MessageBox>
}

const Message =({text,duration,type = messageTypes.info,action=()=>{}}) => {
    const [content,setContent] = useState(null)
    const timer = useRef();

    const buttons = type === messageTypes.confirm
        ? <div>
            <Btn onClick={() => action()}>Y</Btn>
            <Btn onClick={() => action()}>N</Btn>
          </div>
        : '';
    useEffect(() => {
        resetTimer();
        setContent( <MessageBox onClick={() => { setContent(null);    resetTimer();  } }>
                        {text}
                    </MessageBox>);

        if(duration && !isNaN(+duration) && +duration > 0)
            timer.current = setTimeout(() => setContent(null), duration);
        return () => resetTimer();
    },[text,duration])

    const resetTimer = () => timer.current && clearTimeout(timer.current);
    return {content}
}


export default Message
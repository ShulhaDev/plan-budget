import React, {useState} from "react";
import Panel from "../Common/Panel";
import Form from "../Common/Form";
import Block from "../Common/Block";
import Btn from "../Common/Btn";
import Row from "../Common/Row";
import Curtain from "../Common/Curtain";
import {useHistory} from "react-router";
import Column from "../Common/Column";
import {Input, Link} from "./stuff";
import { useQuery} from "@apollo/client";
import {LOG_IN} from "../../Apollo/queries";

const SignIn = () => {
    const history = useHistory();
    const [login,setLogin] = useState('');
    const [password,setPassword] = useState({value:'',visible: false})
    const {refetch} = useQuery(LOG_IN,{variables: {credentials:{login:'',password: '',sex:''}}})
    const submit = e => {
        e.preventDefault();
        refetch({credentials:{login,password: password.value, sex:'whatever'}})
            .then(({data}) => {
                if(data?.res){
                    localStorage.setItem('token',data?.res)
                    history.push('/basket')
                }


            })
            .catch(err => alert(err.message))
        //send req
    }

    const handleChange = e => {
        switch( e.target.id){
            case "login": setLogin( e.target.value);  break;
            case "password": setPassword(prev => ({...prev, value: e.target.value}));  break;
            default: return;
        }
    }
    const toggleVisibility = () => {
        setPassword(prev => ({...prev,visible: !prev.visible}));
    }
    return <Curtain>
        <Panel>
            <Block>
            <Form onSubmit={submit}>
                <Block header={true}>Пожалуйста, представьтесь</Block>
                <Row>

                        <Block>
                            <Column>
                            <Input value={login}
                                   type={"text"}
                                   id={"login"}
                                   placeholder={"Логин"}
                                   onChange={handleChange}/>
                            <div style={{margin: "0",padding:"0"}}>
                            <Input value={password.value}
                                   type={password.visible ? "text":"password"}
                                   id={"password"}
                                   placeholder={"Пароль"}
                                   onChange={handleChange}/><Btn title={"Показать/скрыть"} type="button" onClick={toggleVisibility}>{password.visible ? 'a' : '*'}</Btn>
                            </div>
                            </Column>

                    </Block>
                    <Btn type={"submit"} title={"Войти"}>➧</Btn>
                </Row>
            </Form>
            <Block header={true}>или <Link href={""} onClick={()=> history.push('/registration')}>зарегистрируйтесь</Link></Block>
            </Block>
        </Panel>
    </Curtain>
}

export default SignIn;
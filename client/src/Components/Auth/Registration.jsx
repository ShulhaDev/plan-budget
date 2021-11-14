import React, {useState} from "react";
import Curtain from "../Common/Curtain";
import Panel from "../Common/Panel";
import Block from "../Common/Block";
import Row from "../Common/Row";
import Btn from "../Common/Btn";
import Form from "../Common/Form";
import {Input, Link} from "./stuff";
import {useHistory} from "react-router";
import Column from "../Common/Column";
import {useMutation} from "@apollo/client";
import {REGISTER} from "../../Apollo/queries";

const sexes = {
    'муж.': 'male',
    'жен.': 'female'
}

const GroupPicker = React.forwardRef(({caption,options,defaultValue},ref) => {
    const [value,setValue] = useState(defaultValue);
    return  <>
        {caption}
    <div style={{display: "flex"}}>
        {options?.map(opt => <span key ={opt}>
            {opt}
            <input  ref={ref}
                    readOnly={true}
                    checked={opt === value}
                    onClick={() => setValue(opt)}
                    type={"radio"}
                    value={opt}/>
            </span>)}
    </div>
    </>
})

const Registration = () => {
    const history = useHistory();
    const [login,setLogin] = useState('');
    const [password,setPassword] = useState('');
    const [c_password,setCpassword] = useState('');
    const [errors,setErrors] = useState({});
    const [register] = useMutation(REGISTER,{variables: {credentials: {login: null,password: null}}})

    const sex = React.createRef();
    const submit = e => {
        e.preventDefault();
        if(!(login && login.length))
            return setErrors(prev => ({...prev, login: "Вы не ввели логин"}))
        if(!password.length)
            return setErrors(prev => ({...prev, password: "Вы не ввели пароль"}))
        if(!c_password.length || c_password !== password)
            return setErrors(prev => ({...prev, c_password: "Пароли не совпадают"}))
        const sex_value = sexes[sex.current.value];
        register({variables: {credentials :{login,password,sex: sex_value}}})
            .then(({res}) => alert(res)).catch(err => alert(err.message))
        //send req
    }

    const handleChange = e => {
        switch( e.target.id){
            case "login": setLogin( e.target.value);  setErrors(prev => ({...prev, login: undefined})); break;
            case "password": setPassword(e.target.value); setErrors(prev => ({...prev, password: undefined})); break;
            case "c_password": setCpassword(e.target.value); setErrors(prev => ({...prev, c_password: undefined}));  break;
            default: return;
        }
    }

    return <Curtain>
        {(errors.login || errors.password || errors.c_password) && <>
            <Block  style={{position:"absolute", margin: '1rem auto',color: 'lightcoral',left: '50%',transform: 'translateX(-50%)'}}>
                {errors.login || errors.password || errors.c_password}
            </Block>
        </>}
        <Panel>
            <Block>
            <Form onSubmit={submit}>
                <Block header={true}>Введите свои данные</Block>
                <Row>

                        <Block>
                            <Column>
                            <Input value={login}
                                   error = {errors.login}
                                   type={"text"}
                                   id={"login"}
                                   placeholder={"Логин"}
                                   onChange={handleChange}/>
                            <Input value={password}
                                   type={"password"}
                                   error = {errors.password}
                                   id={"password"}
                                   placeholder={"Пароль"}
                                   onChange={handleChange}/>
                            <Input value={c_password}
                                   type={"password"}
                                   error = {errors.c_password}
                                   id={"c_password"}
                                   placeholder={"Повторите пароль"}
                                   onChange={handleChange}/>
                                <GroupPicker ref={sex} caption={"Пол:"} options={Object.keys(sexes)} defaultValue={Object.keys(sexes)[0]}/>
                            </Column>
                        </Block>
                    <Btn type={"submit"} title={"Сохранить"}>➧</Btn>
                </Row>
            </Form>
                <Block header={true}><Link onClick={()=> history.push('/signIn')}>назад</Link></Block>
            </Block>
        </Panel>
    </Curtain>
}

export default Registration
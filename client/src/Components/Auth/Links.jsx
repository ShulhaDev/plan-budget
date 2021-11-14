import React from 'react'
import styled from 'styled-components'
import Btn from "../Common/Btn";
//eslint-disable-next-line
import styles from './Links.scss'
import {useHistory} from "react-router";


const Icon = styled.div.attrs(props => ({className: props.sex}))`
  width: 1.5rem;
  height: 1.5rem;
  display: inline-block;
  background-size: 1.5rem;
  background-position: 50%;
`
const Sign = styled.div`
  display: flex;
  align-items: center;
  padding: 0;
  margin-right: 1rem;
  margin-left: auto;
`

const Logout = ({user}) => {
    const history = useHistory();
    if(!user)
        return null;
    const logout = () => {
        localStorage.removeItem('token');
        history.push('/signIn');
    }
    return  <Sign>
                <Icon sex = {user.sex}/>
                <label>{user.login}</label>
                <Btn type={"button"} title={"Выйти"} onClick={logout}>⎋</Btn>
        </Sign>
}

const Login = () => {
    const history = useHistory();
    return <Sign>
        <Icon sex={"unknown"}/>
        <span onClick={() => history.push('/signIn')}>{"Sign in"}</span>
    </Sign>
}

export {Login,Logout}
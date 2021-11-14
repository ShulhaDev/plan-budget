import {Redirect} from "react-router";
import Msg from "../Components/Common/Msg";
import React, {useEffect} from "react";

const withAuth = Component => ({user,...props}) => {
    const token = localStorage.getItem('token');
    useEffect(() => {},[user?.login]);
    if(!token)
        return <Redirect to={"/signIn"} />
    if(!user)
        return <Msg className={'manager'}>Загрузка данных... </Msg>
    return <Component {...props}/>
}

export default withAuth;
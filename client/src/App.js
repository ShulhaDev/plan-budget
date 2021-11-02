import './App.scss';
import React from 'react';
import {currentDate} from "./utils/utils";
import {Route, Switch, useHistory} from "react-router";
import { useLocation } from 'react-router-dom';
import styled from "styled-components"
import Basket from "./Components/Basket/Basket";
import Names from "./Components/Names/Names";
import Stats from "./Components/Stats/Stats";
import Msg from "./Components/Common/Msg";
import {useData} from "./Apollo/hooks";
import {DataContext} from "./Apollo/context";

const Anchor = styled.a`
	text-decoration: none;
	color: white;
    cursor: pointer;
	text-shadow: 0 0 2px grey;
	margin: 0 1rem;
	&:hover, &.here{
		width: inherit;
		height: inherit;
		text-shadow: 2px 0 2px black, 1px 3px 9px rgba(200,255,200,1);
		transform: translateX(-1px) translateY(-3px);
	}
	transition: .3s;
`

const Links = styled.span`
	display: inline-flex;
	
	justify-content: space-around;
	margin: 0 auto;
`


function App() {
    const date = currentDate();
    let history = useHistory();
	const location = useLocation();
    const {loading,error,data,refetchData} = useData();
    if(loading)
        return <Msg>Загрузка данных, пожалуйста подождите...</Msg>
    if(error)
        return <Msg>Не удалось загрузить данные: <span style={{color: "pink"}}>{error.message}</span></Msg>

    const goTo = (e,path) => {
        e.preventDefault();
        history.push(path);
    }
  return (
      <DataContext.Provider value={{data,refetchData}}>
          <div className="App">
              <header className="plan">
                  Plan Budget <Links>
                  <Anchor className = {location.pathname === '/names' ? "here" : ""} onClick={e => goTo(e, '/names')}>{'Списки'}</Anchor>
                  <Anchor className = {location.pathname === '/basket' ? "here" : ""} onClick={e => goTo(e, '/basket')}>{'Регистрация чека'}</Anchor>
                  <Anchor className = {location.pathname.startsWith('/stats') ? "here" : ""} onClick={e => goTo(e, '/stats/totals')}>{'Статистика'}</Anchor>
              </Links>
              </header>
              <main className={'p10'}>
                  <Switch>
                      <Route path={'/basket'} component={() => <Basket date={date}/>}/>
                      <Route path={'/names'} component={Names}/>
                      <Route path={'/stats/'} component={Stats}/>
                  </Switch>
              </main>

          </div>
      </DataContext.Provider>
  );
}

export default App;

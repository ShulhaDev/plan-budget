import React,{useContext} from 'react'
import {DataContext} from "../../Apollo/context";
import Charts from "./Charts"
import Totals from "./Totals";
import StatsNavigation from "./StatsNavigation";
import { Switch,Route} from "react-router-dom";
import withAuth from "../../HOCs/withAuth";

const side =  () => <StatsNavigation links={links} />;

const links = [
	{	path: "/stats/totals",   caption: "Итоги"	},
	{	path: "/stats/charts", 	 caption: "Цены"	}
];

const Stats = () => {
	const {data} = useContext(DataContext);
    return <>        
			<Switch>
				 <Route path={'/stats/totals'} component={() => <Totals data ={data} side = {side()}/>} />
				 <Route path={'/stats/charts'} component={() => <Charts side={side()} items={data.items} stores={data.stores}/>} />
				 <Route path={"/stats"} component={side}/>
			</Switch>
        
    </>
}

export default withAuth(Stats);
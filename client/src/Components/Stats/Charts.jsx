import React,{useState,useEffect} from "react";
import Panel from "../Common/Panel"
import Filter from "../Common/Filter"
import Block from "../Common/Block"
import Column from "../Common/Column"
import Row from "../Common/Row"
import {useQuery} from "@apollo/client"
import {GET_PURCHASES} from "../../Apollo/queries"
import {colors, currentDate, dot2, greater, months} from "../../utils/utils"


import styled from "styled-components"

import { Bar } from "react-chartjs-2";
import DatePicker from "../Common/DatePicker";

const ChartFrame = styled.div`
	padding: .4rem;
	border-radius: .3rem;
	width: 40rem; 
	max-height: 20rem;
	min-height: 20rem;
	text-shadow: none;
	background-color: khaki;
`

// const data_test = {
// 	labels: ["Окт.",
// 			"6",
// 		    "11",
// 			"12",
// 			"13",
// 			"16",
// 			"17",
// 			"19",
// 			"22",
// 			"24",
// 			"27"],
// 	datasets: [
// 		{
// 			label: "Евроопт",
// 			backgroundColor: colors[0],
// 			data: [	0,33, 0, 53, 85, 0, 41, 44, 65, 0],
// 		},
// 		{
// 			label: "Алми",
// 			backgroundColor: colors[1],
// 			data: [0, 0, 33, 25, 35, 51,0,0,0, 54, 76]
// 		}
// 	]
// }

const  getCfg = (data,stores) => {
	const dates = [...new Set(data.map(pcs => pcs.date))].sort((a,b) => greater(a,b) ? 1 : -1);
	const latest =  [0,13];//dates[0].split('-').slice(0,-2).map(v => +v);
	const labels = [];
	const datasets = [...new Set(data.map(pcs => pcs.id_store))]
		.map((st_id,i) => ({
			label: stores.find(st => st.id === st_id)?.name || '',
			backgroundColor: i > 9 ? colors.default :colors[i],
			data: [],
			id: st_id
		}));
	dates.forEach(dt => {
		const [y, m, d] = dt.split('-').map(v => +v);
		if (y !== latest[0]) {
			latest[0] = y;
			latest[1] = m;
			labels.push(y + ',' + months[m - 1]);
			datasets.forEach(ds => ds.data.push(0))
		}
		if (latest[1] !== m) {
			latest[1] = m;
			labels.push(months[m - 1])
			datasets.forEach(ds => ds.data.push(0))
		}
		labels.push(d + '')
		datasets.forEach(ds => ds.data.push(+data.find(pcs => pcs.id_store === ds.id && pcs.date === dt)?.price || 0  ))
	})
	return {labels,datasets}
}

const getStats = purchases => {
	const sorted = purchases?.length ? [...purchases].sort((a, b) => +a.price > +b.price ? -1 : 1) : null;
	if (!sorted) return null
	return {
		maxPrice: sorted[0].price,
		minPrice: sorted.slice(-1).pop().price,
		totalMoney: dot2(sorted.reduce((sum,next) => sum + +next.price * +next.amount,0)+'')
	}
}


const Prices = ({stats = null}) => {
	return <div style={{alignSelf: "flex-start", margin: "1rem auto", width: "15rem"}}>
			<Block>
			{ stats ?
				<Column>
					<span>Максимальная цена:<Block right={true}>{stats.maxPrice}</Block></span>
					<span>Минимальная цена:<Block right={true}>{stats.minPrice}</Block></span>
					<span>Итого за период:<Block right={true}>{stats.totalMoney}</Block></span>
				</Column>
				: <Block>Нет данных</Block>
			}
			</Block>
	</div>
}

const c_date = currentDate();

// const defaultStore = {id: -1,name: ''};

 const Charts = ({side,items,stores}) => {
	 const [value, setValue] = useState('');
	 const [item, setItem] = useState(null);
	 const [dstart, setDstart] = useState(c_date);
	 const [stats,setStats] = useState(null);
	 const [dend, setDend] = useState(c_date);
	 const {data: dataPcs,refetch: refetchPcs} = useQuery(GET_PURCHASES, {variables: {filter: {id_item: item?.id, dstart, dend}}});
	 const[dataChart,setDataChart] = useState(null);
	 
	
	 const submit = () => {
		 const found = items.find(it => it.name === value);
		 if (found)
			 setItem(found);
	 }

	 useEffect(() => refetchPcs(),[refetchPcs,dstart,dend,item]);
	 useEffect(() => {
		if(dataPcs?.res && item){
			setDataChart( getCfg(dataPcs.res,stores))
			setStats(getStats(dataPcs?.res));
		}
	 },[dataPcs,item,stores]);
  
  return <> 
			<div className={"side"}>
				{side}
				<Panel>
					<div style={{maxHeight: "100vh", overflowY: "scroll"}}>
						<Column>
							 Период
							 <DatePicker caption={<div>C: </div>} value={dstart} update={val => setDstart(val)}/>
							 <DatePicker caption={<div>По: </div>} value={dend} update={val => setDend(val)}/>
							 <Filter caption={'Товар/услуга'}
								id={'items'}
								value={value}
								update={val => setValue(val)}
								submit={() => setValue('') || submit()}
								options={items}
							/>
							
						</Column>
					</div>
				</Panel>
			</div>
			<div className={"manager"}>

 				<Panel style={{width: "fit-content"}}>
				<Block header={true}>{item?.name || 'Не выбран товар/услуга'}</Block>
					<Row>
					<Prices stats = {stats}/>
					
					<div style={{width: "", padding: "1rem", marginLeft: "auto"}}>
						<Block>
						
							{dataChart ? <ChartFrame>
								<Bar type="bar" className="data" data = {dataChart} />
							</ChartFrame> : <Block>Нет данных</Block>
						}
						</Block>
					</div>
					</Row>
				</Panel>
				
			</div>
		 </>
}

export default Charts


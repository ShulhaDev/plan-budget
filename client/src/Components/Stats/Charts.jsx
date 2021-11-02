import React,{useState,useEffect} from "react";
import Panel from "../Common/Panel"
import Filter from "../Common/Filter"
import Block from "../Common/Block"
import Btn from "../Common/Btn"
import Column from "../Common/Column"
import Row from "../Common/Row"
import Form from "../Common/Form"
import InputFromList from "../InputFromList/InputFromList"
import {useQuery} from "@apollo/client"
import {GET_DATES,GET_PURCHASES} from "../../Apollo/queries"
import {colors,currentDate,daysInMonth,lz2,maxDate,minDate,months,nTimes} from "../../utils/utils"


import styled from "styled-components"

import { Chart, defaults } from "react-charts";

const ChartFrame = styled.div`
	padding: .4rem;
	border-radius: .3rem;
	width: 40rem; 
	max-height: 30rem;
	min-height: 30rem;
	text-shadow: none;
	background-color: khaki;
`

const data1 =  [
			{
				label: "Евроопт",
				data: [
					{x:  new Date("2021-10-11") ,xl: "some", y: 33},
					{x:  new Date("2021-10-13"), y: 53},
					{x:  new Date("2021-10-16"), y: 85},
					{x:  new Date("2021-10-17"), y: 41}, 
					{x:  new Date("2021-10-19"), y: 44}, 
					{x:  new Date("2021-10-27"), y: 65}
				],
				parsing: {xAxisKey: 'x1'}
			},
			{
				label: "Алми",
				data: [
					{x: new Date("2021-10-06"), y: 33}, 
					{x: new Date("2021-10-12"), y: 25},
					{x: new Date("2021-10-13"), y: 35}, 
					{x: new Date("2021-10-17"), y: 51}, 
					{x: new Date("2021-10-22"), y: 54}, 
					{x: new Date("2021-10-24"), y: 76}
				
				],
				parsing: {xAxisKey: 'x1'}
			}
	]

const axes = [
	{ primary: true, type: 'linear',position: 'bottom'},
	{ type: 'linear', position: 'left'}
]

const options = {
  scales: {
	xAxes: {
		type: "time",
		time: {
			unit: 'day'
		},
		parsing: true,
		parser: "DD-MM-YYYY"
	},
	y: {
		type: 'line'
	}
  }
};

const DateI = styled.input`
	margin-left: .5rem;
	width: calc(10.7rem);
`

const DatePicker = ({value,update,caption}) => {
	const [sValue,setSValue] = useState(value || currentDate());
	return <div style={{margin: ".2rem .5rem", width: "90%"}}>
		{caption}
		<Form onSubmit={e => e.preventDefault() || (update && update(sValue))}>
				<DateI type={"date"} value={sValue} onChange={e => setSValue(e.target.value)}/>
				<Btn type={"submit"}>➧</Btn>			
		</Form>
		</div>
}


const Prices = ({stats = null}) => {
	return <div style={{alignSelf: "flex-start", margin: "1rem auto", width: "15rem"}}>
			<Block>
			{ stats ?
				<Column>
					<div>1</div>
					<div>1</div>
					<div>1</div>
				</Column>
				: <Block>Нет данных</Block>
			}
			</Block>
	</div>
}

const c_date = currentDate();

const mDays = (year,month,day = 0) => {

	const prefix = [ [year,lz2(month),lz2(Math.abs(day) || 1)].join('-') , month === 1 ? year + '' : months[month-1]]; 
	console.log('prefix',prefix);
	if(day < 0) // to end
		return [prefix, ...nTimes(daysInMonth(year,month-1) + day + 1, (_,i) => [[year,lz2(month),lz2(i - day)].join('-'),/*i - day +*/ ''] )];
	else 	//from start
		return [prefix,...nTimes(day || daysInMonth(year,month-1), (_,i) => [[year,lz2(month),lz2(i + 1)].join('-') ,/*i + 1 + */ '']).slice(1)];
}

const daysBetween = (date1,date2) => {
	if(date1 === date2) return date1;
	let [y1,m1,d1] = minDate([date1,date2]).split('-').map(v => +v);
	const [y2,m2,d2] = maxDate([date1,date2]).split('-').map(v => +v);
	console.log(date1,date2);
	let total = {};
	while(!(y1 === y2 && m1 === m2)){
		total = {...total,...Object.fromEntries(mDays(y1,m1++,-d1))}
		if(m1 > 12){
			y1++;
			m1 = 1;
		}
		if(d1) 
			d1=0;
	}
	total = {...total,...Object.fromEntries(mDays(y2,m2,d2))}
	return total;
}

const defaultStore = {id: -1,name: ''};

 const Charts = ({side,items,stores}) => {
	 const [value, setValue] = useState('');
	 const [item, setItem] = useState(null);
	 const [dstart, setDstart] = useState(c_date);
	 const [dend, setDend] = useState(c_date);
	 const [labels,setLabels] = useState(null);
	 const {data: dataPcs,refetch: refetchPcs} = useQuery(GET_PURCHASES, {variables: {filter: {id_item: item?.id, dstart, dend}}});
	 const {data ,refetch} = useQuery(GET_DATES, {variables: {filter: {id_item: item?.id, dstart, dend}}});
	 const[dataChart,setDataChart] = useState(null);
	 
	
	 const submit = () => {
		 const found = items.find(it => it.name === value);
		 if (found)
			 setItem(found);
	 }
	 const update = val => setValue(val);
	 useEffect (() => {
		if(data?.res){
			const maxDate = data.res.slice(-1).pop();
			const minDate = data.res[0];
			setLabels(daysBetween(minDate,maxDate));			
		} 
	 },[data])
	 //useEffect(() =>  setDataChart(data1),[data1])
	 useEffect(() => refetch(),[dstart,dend,item]);
	 useEffect(() => { 
		if(dataPcs?.res && labels && item){
			const datasets = [...new Set(dataPcs.res.map(pcs => stores.find(st => +st.id === +pcs.id_store) || defaultStore ) )]
								 .sort((a,b) => a.name > b.name ? 1 : -1  )
								 .map((st,i) => {
												 	const pcss = 
													  dataPcs.res
													   .filter(pcs => +pcs.id_store === +st.id)
													   .sort((a,b) => a.date > b.date ? 1 : -1);
													let position = 0;
													return {
														label: st.name,
														data: pcss.map(pcs => ({x: pcs.date, y: +pcs.price}))
														//data: Object.keys(labels).reduce((values,key) => [...values,  +pcss[(key === pcss[position]?.date ? position++ +1 : position)]?.price || values.slice(-1)?.pop() || 0],[]),
														//fill: false,
														//borderColor: i > 9 ? colors.default : colors[i] 
													}
								 });
								 console.log('labels',labels,'purchases',dataPcs.res);
								 console.log(datasets);
								 setDataChart( datasets )
		}
	 },[labels,dataPcs]);
  
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
				{item ? <Block header={true}>{item.name}</Block> : ''}
					<Row>
					<Prices />
					
					<div style={{width: "", padding: "1rem", marginLeft: "auto"}}>
						<Block>
						
							{data1 ? <ChartFrame>
								<Chart axes={axes} className="data" data={data1} options={options}/>
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
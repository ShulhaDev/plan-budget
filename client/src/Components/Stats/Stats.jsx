import React,{useState,useContext,useEffect,useCallback} from 'react'
import Panel from "../Common/Panel";
import InputFromList from "../InputFromList/InputFromList";
import Spec from "../Common/Spec";
import Row from "../Common/Row";
import Column from "../Common/Column";
import Cleaner from "../Common/Cleaner";
import styled from "styled-components";
import Form from "../Common/Form";
import Btn from "../Common/Btn";
import Block from "../Common/Block"
import Filter from "../Common/Filter"
import {useQuery} from "@apollo/client";
import {GET_PURCHASES} from "../../Apollo/queries";
import {DataContext} from "../../Apollo/context";
import {currentDate,sortPurchasesAsc,dot2} from "../../utils/utils";
import {useHistory,useLocation,Route,Switch} from 'react-router-dom';
import Charts from "./Charts"

const FilterLabel = styled.div`
  background-color: darkslategray;
  border-radius: .6rem;
  flex: 5 1;
  padding: .3rem;
  margin: .1rem;
`

/*const Filter = ({caption='n/a', id, value,update,submit,options=[]}) => {
    return <Column>{caption}:<Form onSubmit={e => e.preventDefault() || submit(value)}>
										<InputFromList id={id}
                                            value={value}
                                            update={update}
                                            submit={submit}
                                            options={options}
										/>
                                        <Btn type={"submit"} title={'Применить фильтр'}>➧</Btn>
							 </Form>
    </Column>
}*/

const Filters = ({data,apply}) => {
    const [item,setItem] = useState('');
    const [store,setStore] = useState('')
    const [group,setGroup] = useState('');
    const [special,setSpecial] = useState(null)

    const toggleSpecial = e => {
        const newSpec =  special === null ? true : special === false ? null : false;
        setSpecial(newSpec);
    }

    return <Panel className={"side"}>
        Фильтры
        <div style={{maxHeight: "100vh", overflowY: "scroll"}}>
        <Column>
            <Filter caption={'Товар/услуга'}
                    id={'items'}
                    value={item}
                    update={val => setItem(val)}
                    submit={() => setItem('') || (apply && apply('Т','items',item))}
                    options={data.items}
            />
            <Filter caption={'Магазин/место'}
                    id={'stores'}
                    value={store}
                    update={val => setStore(val)}
                    submit={() => setStore('') || (apply && apply('М','stores',store))}
                    options={data.stores}
            />
            <Filter caption={'Категория'}
                    id={'groups'}
                    value={group}
                    update={val => setGroup(val)}
                    submit={() => setGroup('') || (apply && apply('К','groups',group))}
                    options={data.groups}
            />
            <Form style={{display: "flex", justifyContent: "flex-end",width: "97%"}} 
				  onSubmit={e => e.preventDefault() || (apply && apply("Акция","special",special))}>
				  <Spec state={special} onClick={toggleSpecial}>Акция </Spec>
				  <Btn type={"submit"}>➧</Btn>
			</Form>
        </Column>
        </div>
    </Panel>
}

const StatLink = styled.a`
	color: inherit;
	text-decoration: none;
	font: inherit;
	display: inline-block;
	flex: 1 1;
	transition: .1s;
	${props => props.active ? 'transform: translateX(.5rem); &:before { content: "➧ "}; color: khaki' : ''}
	
	
`

const StatsNavigation = ({links = []}) => {
	const history = useHistory();
	const location = useLocation();
	if(!links.length)
		return null;
	return <Panel>
				<Block header={true} style={{minWidth: "17rem"}}>
					Статистика
				</Block>
				<Block>
					<Column>
						{links.map(lnk => <div key={lnk.path}>
											 <StatLink href={"#"} active = {location.pathname === lnk.path} 
																  onClick={e => e.preventDefault() || history.push(lnk.path)}>{lnk.caption}</StatLink>
										  </div>)}
					</Column>
				</Block>
			</Panel>
}

const Totals =({data,side}) => {
	const [filters,setFilters]  = useState([]);
	const [date1,setDate1] = useState(currentDate());
	const [date2,setDate2] = useState(currentDate());
	const [statLines,setStatLines] = useState(null);
	const dates = {
		"date1": setDate1,
		"date2": setDate2
	}
	
	const buildFilter = (d1,d2) => {
        const filter = {
			date1: d1,
			date2: d2
		};

        filters.forEach(fr => {
            switch(fr.id){
                case "items": case "groups": case "stores":
                    filter["id_"+fr.id.slice(0,-1)] = data[fr.id].find(d => d.name === fr.value).id;
                    break;
				case "special":
					filter.special = fr.value;	
					break;
                default: break;
            }
        })
        return filter;
    }
    const {loading, data: pData,error} = useQuery(GET_PURCHASES,{variables: {filter:{...buildFilter(date1,date2)}}})
    
	useEffect (()=> {
		if(pData?.res){
			const ids = [...new Set(pData.res.map(pcs => pcs.id_item))].sort(sortPurchasesAsc(data.items));
			const lines = ids.map(id => {
				const base = {id,name: data.items.find(it => it.id === id)?.name || '',price: 0,amount: 0}
				return pData.res
				.filter(pcs => +pcs.id_item === +id)
				.reduce((obj,next)=> ({
										...obj,
										amount: +obj.amount + +next.amount,
										price:  +obj.price + +next.amount * +next.price}),base)
			})
			setStatLines(lines);
		}
		
	},[pData,data.items]);
	
	
    const applyFilter = (mark, id, value) => {
        setFilters(prev => {
            let newFilters = [...prev.filter(fr => fr.id !== id)];
            let item = prev.find(fr => fr.id === id);
            if(item){
				if(value !== null)
					item.value = value;
				else 
					return newFilters.filter(fr => fr.id !== item.id)
			}
            else
                if(value !== null && value !== '')
                    item = {mark,id,value}
            if(item)
                newFilters.push(item);
            return newFilters;

        });
    }

    const remove = id => {
        setFilters(prev => prev.filter(fr => fr.id !== id))
    }
	
	const handleDateChange = e => {
		dates[e.target.id] && dates[e.target.id](e.target.value);
	}
	
	const results = statLines && statLines.length
		? <>
			<Block>
				<Row>
					<Block header={true}>Товар/услуга</Block>
					<Block header={true} title={'Итоговое количество (штук/кг./г./раз)'} right={true}>Количество</Block>
					<Block header={true} title={"Суммарная стоимость, BYN"} right={true}>Стоимость</Block>
				</Row>
				{statLines.map(sl => <StatLine key = {sl.name} line={sl}/>)}
			</Block>
			<Block >
				<Row>
					<div style={{flex: '8 1', textAlign: "right"}} >{`Итого: `}</div>
					<Block right={true}>{dot2(statLines.reduce((sum,sl) => sum + +sl.price,0))}</Block>
				</Row>
			</Block>
		</>
		: <Block>Ничего не найдено :( </Block>
	
	return <>
			<div className={"side"}>
				{side}
				<Filters data={data } apply={applyFilter}/>
			</div>
			<div className ={"manager"}>
			<Panel>
			<div style={{width: "fit-content", margin: "0 auto"}}>
                Период:    c <input id={"date1"} type={"date"} onChange={handleDateChange} value={date1}/>  по  <input id ={"date2"} type={"date"} onChange={handleDateChange} value={date2}/>
			</div>
                <hr/>
                <Row>{filters
                    ? filters.map(fr => <FilterLabel key={fr.id} className={"flying_pane"}><span style={{textDecoration: `${!fr.value ? 'line-through': 'initial'}`}}>{fr.mark}</span>: {fr.value}<Cleaner action={() => remove(fr.id)}/></FilterLabel>)
                    : <div>Фильтры не заданы</div>}
                </Row>

            </Panel>
            <Panel>
                Результаты:
					{loading ? "Загрузка данных..." : ""}
					{error ? <div>{` Ошибка загрузки данных: ${error.message}`}</div> : ""}
					{results}
            </Panel>
			</div>
			
		  </>
}


const StatLine = ({line}) => <Row style={{width: "calc(100% - 1rem)"}}><Block>{line.name}</Block> <Block right={true}>{dot2(line.amount)}</Block> <Block right={true}>{dot2(line.price)}</Block> </Row>

const side = links => () => <StatsNavigation links={links} />;

const Stats = () => {
    	
	const {data} = useContext(DataContext);
	const links = [
		{	path: "/stats/totals",   caption: "Итоги"	},
		{	path: "/stats/charts", 	 caption: "Цены"	}
	];
	
	const Side = useCallback(side(links),[])
	
    return <>        
			<Switch>
				 <Route path={'/stats/totals'} component={() => <Totals data ={data} side = {<Side />}/>} />
				 <Route path={'/stats/charts'} component={() => <Charts side={<Side/>} items={data.items} stores={data.stores}/>} />
				 <Route path={"/stats"} component={Side}/>
			</Switch>           
        
    </>
}

export default Stats
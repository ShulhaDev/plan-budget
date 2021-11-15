import React, {useEffect, useState} from "react";
import {currentDate, dot2, sortPurchasesAsc} from "../../utils/utils";
import {useQuery} from "@apollo/client";
import {GET_PURCHASES} from "../../Apollo/queries";
import Block from "../Common/Block";
import Row from "../Common/Row";
import Panel from "../Common/Panel";
import Cleaner from "../Common/Cleaner";
import Filters, {FilterLabel} from "./Filters";
import DatePicker from "../Common/DatePicker";

const StatLine = ({line}) => <Row style={{width: "calc(100% - 1rem)"}}>
                                <Block>{line.name}</Block>
                                <Block right={true}>{dot2(line.amount)}</Block>
                                <Block right={true}>{dot2(line.price)}</Block>
                             </Row>

const Totals =({data,side}) => {
    const [filters,setFilters]  = useState([]);
    const [date1,setDate1] = useState(currentDate());
    const [date2,setDate2] = useState(currentDate());
    const [statLines,setStatLines] = useState(null);

    const buildFilter = (d1,d2) => {
        const filter = {
            dstart: d1,
            dend: d2
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
                <div>
                    {/*Период:    c <input id={"date1"} type={"date"} onChange={handleDateChange} value={date1}/>  по  <input id ={"date2"} type={"date"} onChange={handleDateChange} value={date2}/>*/}
                    {`Период:`}<Row> <DatePicker caption={`с`} value={date1} update={val => setDate1(val)}/>
                                     <DatePicker caption={`по`}  value={date2} update={val => setDate2(val) }/>
                               </Row>
                </div>
                <hr/>
                <Row>{filters?.length
                    ? [...filters.map(fr => <FilterLabel key={fr.id}><span style={{textDecoration: `${!fr.value ? 'line-through': 'initial'}`}}>{fr.mark}</span>: {fr.value}<Cleaner action={() => remove(fr.id)}/></FilterLabel>),<div/>]
                    : <Block>Фильтры не заданы</Block>}
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

export default Totals
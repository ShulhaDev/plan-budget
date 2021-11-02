import React,{useEffect,useState,useRef} from 'react'
import {useQuery} from '@apollo/client'
import {GET_ITEMS,GET_ITEM_NAMES,GET_STORES} from '../../Apollo/queries'
// import Basket from './Basket'
import Cleaner from '../Common/Cleaner'
import Options from '../Common/Options'
import FadeMsg from '../Common/FadeMsg'
import styled from 'styled-components'

const useData = () => {
	const {loading: l1,error: er1, data: d1, refetch: r1} = useQuery(GET_ITEM_NAMES);
	const {loading: l2,error: er2, data: d2,refetch: r2} = useQuery(GET_STORES);
	const [items,setItems] = useState([]);
	const [stores,setStores] = useState([]);
	const sortAsc = (a,b) => a.name > b.name ? 1 : -1
	useEffect(()=>{
		console.log(d1?.items);
		setItems(d1?.items ? [...d1.items].sort(sortAsc) : []);
	},[d1]);
	
	useEffect(()=>{
		setStores(d2?.stores ? [...d2.stores].sort(sortAsc) : []);
	},[d2])
	return {loading: l1 || l2, data: {items,stores}, refetch: {stores: r2, items: r1}, error: er1 || er2}
}

const Content = styled.div`
	display: flex;
	position: relative; 
	flex-flow: column nowrap;
	& > div{
		flex: 1 1 30px;
	}
	& input[type="date"] {

	}
	& input {
		height: 1.4rem;
		background-color: dimgrey;
		border: none;
		border-radius: 4px;
		color: white;
		font: inherit;
		padding: 3px 3px 3px 10px;
		box-shadow: 2px 1px 3px 0 inset black;
	}
	& span {
		margin: 2px 5px;
	}
`


const Frame = styled.div`
	width: 90%;
	height: 600px;
	color: white;
	text-shadow: 1px 1px 2px black;
	font: inherit;
	border: 4px groove silver;
	border-radius: 6px;
	margin: 4px auto;
	padding: 10px;
	& input[type="text"].numbers{
		width: 5rem;
		text-align: right;
	}
`


const left_zeroes = (str,len) => {
	while (str.length < len )
		str = '0' + str;
	return str;
}

const currentDate = () => {
	const dt = new Date();
	return [dt.getFullYear(), left_zeroes(dt.getMonth() + 1 +'',2),left_zeroes(dt.getDate() +'',2)].join('-');
}

const BasketContainer = () => {
	const {loading,data,error} = useData();
	const [store,setStore] = useState('');
	const [stores,setStores] = useState([]);
	const [message,setMessage] = useState(null);
	const [date,setDate] = useState(currentDate());
	const items = useQuery(GET_ITEMS,{variables : {filter: { dstart: date}}});
	const timer = useRef();
	
	useEffect(() => {
		if (data && !data.loading){
			setStores(data?.stores || []);
		}
	},[data]);
	
	
	const resetTimer = () => {  clearTimeout(timer.current); timer.current = null;}
	
	const resetDate = e => {
		const val = e.target.value.length ?  e.target.value : currentDate();
		setDate(val);
	}
	
	const closeMsg = () => {
		resetTimer();
		setMessage(null)
	}
	
	if(loading)
		return <p>Загрузка данных, пожалуйста, подождите...</p>
	if(error) 
		return <p>Не удалось загрузить данные: {error.message}</p>
	
	const basket = items.loading 
	?	 <p>Загрузка данных, пожалуйста, подождите...</p>
	: items.error 
		// ? <p>Не удалось загрузить данные: {items.error.message}</p>
		// : <Basket items={items.items} names ={names} stores={stores} />
		
	console.log(items)
	return <Content>
		<span>
			<span>  Магазин: <input type="text" list={"basket_stores"} value={store} onChange={e => setStore(e.target.value)}/> <Cleaner action={() => setStore('')}/> </span>
			<span>  Дата: <input type={"date"} value={date} onChange={resetDate}/></span>
		</span>
		<Options id={"basket_stores"} list={stores}/>	
			{message && <FadeMsg color={"lightcoral"} onClick={closeMsg}>{message}</FadeMsg>}
		<Frame>
			{basket}
		</Frame>
	</Content>
} 


export default BasketContainer
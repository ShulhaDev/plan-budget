import React,{useState,useRef,useEffect} from 'react'
import styled from 'styled-components'
import Btn from "../Common/Btn";
import Form from "../Common/Form";
import {dot2} from "../../utils/utils"
import Spec from "../Common/Spec";

const Block = styled.div`
	display: inline-block;
	border-radius: 4px;
	margin: 0 5px;
	font: inherit;
	& > input{
		margin: 0 3px;
		background-color: rgba(0,0,0,0.1);
		color: white;
		border: none;
		text-align: right;
		font: inherit;
		width: 5rem;
	}
`;

const Total = styled.div`
	margin: 0 5px;
	border-radius: 4px;
	color: white;
	min-width: 6rem;
	max-width: 8rem;
	text-align: right; 
	display: inline-block;
`;

const Amount = ({id,updateMe,price=0,count=1,special=false}) => {
	const [sPrice,setSPrice] = useState(price + '');
	const [sCount,setSCount] = useState(count + '');
	const [spec,setSpec] = useState(special);
	const [sAmount,setSAmount] = useState(+price * +count); 
	const previousAmount = useRef();
	
	useEffect(()=>{previousAmount.current=[[price+'',count+'']];},
		//eslint-disable-next-line
		[]);
	
	const handleChange = e => {
		const val =e.target.value;
		if(isNaN(+val))
			return;
		if(e.target.id === id+"_price")
			setSPrice(val);
		else
			setSCount(val);
	}
	const acceptValue = e => {
		e.preventDefault();
		if(+sPrice * +sCount)
			previousAmount.current = [...previousAmount.current.slice(-4),[sPrice,sCount]];
		setSAmount(+sPrice * +sCount);
		updateMe(id, +sPrice, +sCount,spec);
	}
	
	const undo = () => {
		if(previousAmount.current.length){
			const [pPrice,pCount] =  previousAmount.current.pop();
			setSPrice(pPrice);
			setSCount(pCount);
			setSAmount(+pPrice * +pCount);
			updateMe(id,+pPrice,+pCount)
		}
			
	}
	
	return (
		<div style={{display: "flex", justifyContent: "flex-end"}}>
			<Form  onSubmit={acceptValue}>
				<Block title="Количество">К<input id={id + '_count'} type="text" value={sCount}
												  onChange={handleChange}/></Block>
				<Block title="Цена за единицу/кг">Ц<input type="text" id={id + '_price'} value={sPrice}
														  onChange={handleChange}/></Block>
				<Spec state={spec} onClick ={() => setSpec(prev => !prev)}>Акц.</Spec>
				<Btn type="submit" title={"Добавить"}>{"\u21AA"}</Btn>
			</Form>
			<div>
			<Btn onClick={undo} title={"Вернуть предыдущее значение"}>{"\u21A9"}</Btn>
			<Total title={"Итоговая сумма, BYN"}>{dot2(sAmount) || '0'}</Total>
				</div>
		</div>
	);
};

export default Amount

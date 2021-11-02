import React,{useState,useEffect,useContext} from 'react'
import styled from 'styled-components'
import Btn from '../Common/Btn'
import {useMutation} from "@apollo/client";
import { upserts,removes} from "../../Apollo/queries";
import Panel from "../Common/Panel";
import Row from "../Common/Row"
import Form from "../Common/Form"
import Cleaner from "../Common/Cleaner"
import {DataContext} from "../../Apollo/context";

const Block = styled.div`
	
	width: ${props => props.input ? 'calc(100% - 5rem)' : '8rem'};
	& input {
		width: calc(100% - 3rem);
		margin-right: .4rem;
	}
`

const Buttons = styled.div`
	display: flex;
	align-items: center;
	margin: .5rem;
`

const OptionsManager = ({category='',groups = false,id}) => {
	const [sList,setSList] = useState([]);
	const [value,setValue] = useState('');
	const [group,setGroup] = useState(groups && '');
	const [sGroups,setSGroups] = useState(groups && []);
	const [update] = useMutation(upserts[id]);
	const [remove] = useMutation(removes[id]);
    const {data,refetchData} = useContext(DataContext);
	useEffect(() => {
		setSList(data[id]);
		if(groups)
			setSGroups(data?.groups || [])
	},[data,id,groups])
	const handleChange = e => {
		const [id_i,val] = [e.target.id,e.target.value];
		if(id_i === category){
			const found = sList.find(it => it.name === val);
			if(found && sGroups)
				setGroup(sGroups.find(gr => gr.id === found.id_group).name);
			return setValue(e.target.value);
		}

		if(id_i === "groups")
			return setGroup(e.target.value)
	}
	const addItem = e => {
		e && e.preventDefault && e.preventDefault();
			
		if(!value)
		  return alert('Нельзя добавить пустую запись!')
		update({variables: { payload: {name:value,id_group: sGroups ? sGroups.find(gr => gr.name === group).id: undefined}}})
			.then((_) => refetchData && refetchData())
			.catch(err => alert(err.message));
	}
	const removeItem = () => {
		const id_r = sList.find(it => it.name === value)?.id;
		if(id_r){
			if(window.confirm("Вы действительно хотите удалить запись? Это может затронуть связанные данные")){
				remove({variables: {id: id_r}})
					.then(({data}) => data && refetchData())
					.catch(err => alert(err.message));
				setValue('');
			}
		}
		else
			alert(`Нечего удалять`)
	}
	
	return <Panel>

		<div style={{display: "flex"}}>
		<Form fixed={true} autocomplete="off" onSubmit = {addItem}>
		<Row>
			<Block >{category === '' ? 'Наименование' : category + ": "}</Block>
			<Block input={true}>
				<input id={category} list={category+"_options"} type={"text"} value={value} onChange={handleChange}/>
				<Cleaner action={()=> setValue('')} />
			</Block>
			<datalist id={category+"_options"}>
				{sList.map(item => <option key={item.id} value = {item.name}/>)}
			</datalist>



			</Row>
				{sGroups
					? <Row>
					 	<Block >{'Категория: '}</Block>
						<Block  input={true}>
							<input id={"groups"} type="text" list ={category+"_groups"} value={group} onChange={handleChange}/>
							<Cleaner action={()=> setGroup('')} />
							<datalist id={category+"_groups"}>
							{sGroups.map(gr => <option key={gr.id} value = {gr.name}/>)}
							</datalist>
						</Block>
					</Row>
					: ''}

		</Form>
		<Buttons>
				<Btn type="button" onClick={addItem} title={"Добавить в список"}>⊕</Btn>
				<Btn type="button" onClick={removeItem} title={"Удалить из списка"}>⊖</Btn>
		</Buttons>
		</div>
		
		
	</Panel>
}

export default OptionsManager
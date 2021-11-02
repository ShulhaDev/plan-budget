import React,{useState,useRef,useEffect,useCallback,useContext} from "react";
import styled from 'styled-components'
import styles from './DataManager.module.scss'
import Amount from "../Amount/Amount";
import Calendar from "../Calendar/Calendar";
//import {useData} from "../../Apollo/hooks";
import Panel from "../Common/Panel";
import Form from "../Common/Form";
import {useQuery,useMutation} from "@apollo/client";
import {GET_PURCHASES,UPSERT_PURCHASE,removes} from "../../Apollo/queries";
import InputFromList from "../InputFromList/InputFromList";
import {getNameById,sortPurchasesAsc} from "../../utils/utils";
import {DataContext} from "../../Apollo/context";


const Action = styled.span`
  padding-left: .5rem;
  user-select: none;
  width: fit-content;
  border-left: 1px solid grey;
  text-shadow: 3px 2px 5px rgb(40,40,40);
  cursor: pointer;
`

const Eraser = styled(Action)`
  color: #ff7777;
`

const AddNew = styled(Action)`
  color: limegreen;
`


//const getNameById = (id,set) => set.find(it => +it.id === +id)?.name || '';
//const sortAsc = set => (a,b) => getNameById(a.id_item,set) > getNameById(b.id_item,set) ? 1 : -1

function ItemLine ({line,addNew,options,updateMe,removeMe = () => {},effects={}}) {
    const [sName,setSName] = useState(line ? getNameById(line.id_item,options) : '');
    const previous = useRef();

    if(line) {
		const {id,price,amount,special} = line;
        const remove = () => {
            if(window.confirm('Вы действительно хотите стереть запись?'))
                removeMe(id);
        }

        return <div className={styles.line + ` ${effects.removing ? styles.removed : ''}`}>
            {   <>
					<span>{sName}</span>
                    <Amount id={id} updateMe={updateMe} price={price} count={amount} special={special}/>
                </>
            }
            <Eraser title={'Удалить'} onClick={remove}>✖</Eraser>
        </div>
    }
    else{
		
		const handleItemChange = val => {
            setSName(prev => {previous.current = prev; return val;})
        }
		const handleSubmit = e => {
			e.preventDefault();
			const found = options.find(opt => opt.name === sName);
			if(!found)
				alert ("Нет такого товара!\nПожалуйста выберите товар из списка\nили добавьте его в список (используйте меню 'Списки')");
			else
				addNew && addNew(found)
		}
		
        return <div className={`${styles.line} ${styles.new}`}>
			<span>
				<Form fixed = {true} onSubmit ={handleSubmit}>
					<InputFromList value={sName} caption={"Товар"} options={options} update={handleItemChange} />
				</Form>
			</span>
			<AddNew title={'Добавить'} type={"submit"} onClick={handleSubmit}>✛</AddNew>
        </div>
	}
}

const other = {
    id: -1, name: ""
}

const DataManager = ({date,updateDate}) => {
    //const {loading,data,error} = useData();
	const {data} = useContext(DataContext);
    const [store,setStore] = useState('');
    const [stores,setStores] = useState([other]);
    const [names,setNames] = useState([]);
    const [remove_id,setRemove_id] = useState(null);
    const purchases = useQuery(GET_PURCHASES,{variables : {
    													filter: {
    														dstart: date,
															dend: date,
															id_store: stores.find(st => st.name === store)?.id || -1
    													}
    												 }});
	const [update] = useMutation(UPSERT_PURCHASE);
	const [remove] = useMutation(removes.purchases);
    const [sPurchases,setSPurchases] = useState([]);
	const objD = useRef();

	useEffect(() => objD.current = {},[]);
	
    useEffect(() => {
        if (data && !data.loading){
            if(data.stores)
                setStores(data.stores);
            setNames(data.items)
        }
    },[data]);
	
	

    useEffect(() => {
        setSPurchases(purchases.data ? [...purchases.data.res].sort(sortPurchasesAsc(names)) : []);
    },[purchases,names])
    const add = item => {
		if(sPurchases.find(pcs => pcs.id_item === item.id))
			alert('Товар уже есть в списке');
		else{
			const found = stores.find(st => st.name === store);
			if(!found)
				return alert('Неизвестный магазин/место! Пожалуйста, выберите значение из списка')
			update({variables: {
				purchase: {
					id: -1,
					id_item: +item.id,
					id_store: +found.id,
					id_group: +item.id_group,
					date,price: 0,
					amount: 1,
					special: false
				}}})
			.then( ({data}) => { if(data) purchases.refetch(); objD.current = {}; })
			.catch(err => alert(err.message))
		}
	
    }

    const removeById = id => {
        setRemove_id(id);
        setTimeout(() => {
			remove({variables: {id}})
				.then( ({data}) => { if(data) purchases.refetch(); objD.current = {};})
			//setSPurchases(prev => prev.filter(pcs => pcs.id !== id));
			setRemove_id(null)
		},800);
    }
	
	const synchronize = useCallback( (id,price,count,special=false) => {
		const id_item = sPurchases.find(pcs => +pcs.id === +id).id_item;
		const found = stores.find(st => st.name === store);
		if(!found)
			return;
		update({variables: {purchase: {
									id: +id,
									id_item: +id_item,
									price,
									amount: count,
									date,
									special,
									id_store: +found.id,
									id_group: +found.group
								  }
						  }
			   })
		.then(({data}) => data.res)
		.then(res => setSPurchases(prev => [...prev.filter(it => it.id !== id),{...res}].sort(sortPurchasesAsc(names))))
		.catch(err => alert(err.message))
	},[sPurchases,update,store,stores,date,names]);

	//if(loading) return <Msg>{`  Загрузка данных, пожалуйста, подождите...`}</Msg>
    //if(error) return <Msg>{`  Не удалось загрузить данные:`} <span style={{color: "pink"}}>{error.message}</span></Msg>

    const list = [<ItemLine initialValue={''} key={''} options={names} addNew={add}/>, 
				...sPurchases.sort(sortPurchasesAsc(names)).map( pcs => <ItemLine key={pcs.id}
                                            effects ={{removing: pcs.id === remove_id}}
                                            options = {names}
                                            removeMe={removeById}
											updateMe ={synchronize}
                                            line={pcs} />)];
    return <>
		<Calendar update={updateDate} id_store={+stores.find(st => st.name === store)?.id} fetchDates = {objD.current}/>
		<Panel className={"manager"}>
			<span style={{margin: "1rem"}}>  Регистрация чека: <InputFromList id={"store"}
                                            value={store}
                                            caption={"Магазин"}
                                            options={stores}
                                            update={val => setStore(val)}
                                 />
			</span>
			<div className={styles.list}>{list}</div>
		</Panel>
	</>;
}

export {ItemLine}
export default DataManager;
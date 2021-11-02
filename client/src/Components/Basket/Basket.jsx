import React,{useState,useCallback} from 'react'
//import Calendar from "../Calendar/Calendar";
import DataManager from "../DataManager/DataManager";

const Basket = ({date}) => {
    const [sDate,setSDate] = useState(date);
    const update = useCallback(val => setSDate(val),[])
    return <>
	{/*<Calendar update={update} />*/}
        <DataManager date={sDate} updateDate={update}/>
    </>
}

export default Basket;
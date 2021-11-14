import React,{useState,useCallback} from 'react'
//import Calendar from "../Calendar/Calendar";
import DataManager from "../DataManager/DataManager";
import withAuth from "../../HOCs/withAuth";

const Basket = ({date}) => {
    const [sDate,setSDate] = useState(date);
    const update = useCallback(val => setSDate(val),[])
    return <>
        <DataManager date={sDate} updateDate={update}/>
    </>
}

export default withAuth(Basket);
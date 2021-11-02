import {useQuery} from "@apollo/client";
import {getters} from "./queries";
import {useEffect, useState} from "react";


const useData =  () => {
	const {loading,data,error,refetch: refetchData} = useQuery(getters.data);
    const [items,setItems] = useState([]);
    const [stores,setStores] = useState([]);
	const [groups,setGroups] = useState([]);
    const sortAsc = (a,b) => a.name > b.name ? 1 : -1
	
	 useEffect(()=>{
        setItems(data?.name ? [...data.name].sort(sortAsc) : []);
		setStores(data?.store ? [...data.store].sort(sortAsc) : []);
		setGroups(data?.group ? [...data.group].sort(sortAsc) : []);
    },[data]);

	return {loading, data: {items,stores,groups}, refetchData, error}
}

export {useData}
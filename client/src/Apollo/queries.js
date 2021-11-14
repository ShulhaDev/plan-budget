import gql from "graphql-tag";

const CHECK_TOKEN =gql`
	query checkToken{
		res: checkToken{
			login
			sex
		}
	}
`

const GET_DATA = gql`
	query {
		name: getItems {
			id
			id_group
			name
		}
		store: getStores {
			id
			name
		}
		group: getGroups {
			id
			name
		}
	}
`


const GET_ITEMS = gql`
	query getItems {
		res: getItems {
			id
			id_group
			name
		}
	}
`

const GET_STORES = gql`
	query getStores {
		res: getStores {
			id
			name
		}
	}
`

const GET_GROUPS = gql`
	query getGroups {
		res: getGroups {
			id
			name
		}
	}
`

const GET_PURCHASES = gql`
	query getPurchases($filter: Filter) {
		res: getPurchases(filter: $filter) {
			id 
			id_item 
			id_store 
			id_group
			price
			special
			date
			amount
		}
	}
`

const GET_DATES = gql`
	query GetDates($filter: DatesFilter){
		res : getDates(filter: $filter)
	}
`

const LOG_IN = gql`
	query signIn($credentials: Credentials!) {
		res: signIn(credentials: $credentials)
	}
`

const REGISTER = gql`
	mutation register($credentials: Credentials!) {
		res: registration(credentials: $credentials)
	}
`

const ADD_ITEM = gql`
    mutation AddItem($payload: InputBase!){
        res: addItem(payload: $payload){
			id
			id_group
			name
		}
		
    }
`

const ADD_STORE = gql`
    mutation AddStore($payload: InputBase!){
        res: addStore(payload: $payload) {
			id
			name
		}      
    }
`

const ADD_GROUP = gql`
    mutation AddGroup($payload: InputBase!){
        res: addGroup(payload: $payload) {
			id
			name
		}      
    }
`

const UPSERT_PURCHASE = gql`
	mutation upsertPurchase($purchase: InputPurchase!){
		res: upsertPurchase(purchase: $purchase){
			id
			id_item
			id_store
			price
			special
			date
			amount
		} 
	}
`

const REMOVE_NAME = gql`
	mutation RemoveItem($id: ID!){
        res: removeItem(id: $id) {
			id 
			id_group
			name
		}      
    }
`

const REMOVE_STORE = gql`
	mutation RemoveStore($id: ID!){
        res: removeStore(id: $id) {
			id 
			name
		}       
    }
`

const REMOVE_GROUP = gql`
	mutation RemoveGroup($id: ID!){
        res: removeGroup(id: $id) {
			id 
			name
		}       
    }
`

const REMOVE_PURCHASE = gql`
	mutation RemovePurchase($id: ID!){
        res: removePurchase(id: $id) {
			id
			id_item
			id_store
			price
			special
			date
			amount
		}       
    }
`

const getters ={
	data: GET_DATA,
	name: GET_ITEMS,
	store: GET_STORES,
	group: GET_GROUPS,
	purchase: GET_PURCHASES,
	dates: GET_DATES
}

const upserts = {
    items: ADD_ITEM,
    stores: ADD_STORE,
	groups: ADD_GROUP,
	purchases: UPSERT_PURCHASE
}

const removes = {
	items: REMOVE_NAME,
	stores: REMOVE_STORE,
	groups: REMOVE_GROUP,
	purchases: REMOVE_PURCHASE
}


export {
	CHECK_TOKEN,
	 GET_DATA, GET_ITEMS, GET_STORES, GET_GROUPS, GET_PURCHASES, GET_DATES,   		  // getters
	 ADD_ITEM,ADD_STORE, ADD_GROUP, UPSERT_PURCHASE,  // updates
	 REMOVE_NAME,REMOVE_STORE, REMOVE_GROUP,		  // removes
	 LOG_IN,REGISTER,
	 upserts,removes,getters
}


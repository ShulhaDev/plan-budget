const fs = require("fs");
const {greater} = require("./utils")
const { ApolloServer, gql } = require('apollo-server');

// The GraphQL schema
const typeDefs = gql`
  
  type Item {
    id: ID!
    id_group: ID!
    name: String!
  }
  
  type Store {
    id: ID!
    name: String!
  }
  
  type Group {
    id: ID!
    name: String!
  }
  
  input InputBase {
  	name: String!
  	id_group: ID
  }

  type Purchase {
	id: ID!
	id_item: ID!
	id_store: ID!
	id_group: ID
    price: String!
    special: Boolean
    date: String!
    amount: String!
  }
   
  input InputPurchase {
	id: ID!
    id_item: ID!
	id_store: ID 
	id_group: ID
    price: Float!
	amount: Float!
	special: Boolean!
	date: String!
  }
  
  input DatesFilter {
	  id_item: ID
	  id_store: Int
	  year: Int
	  month: Int
	  dstart: String
	  dend: String
  }
  
  input Filter {
	  id_item: ID
	  id_store: ID
	  id_group: ID
	  dstart: String
	  dend: String
	  special: Boolean
	  price1: Float
	  price2: Float
	  count1: Float
	  count2: Float
  }
  
  type Query {
	getItems(filter: Filter): [Item!]  
    getStores: [Store!]
	getGroups: [Group!]
	getPurchases(filter: Filter): [Purchase!]!
	getDates(filter: DatesFilter): [String!]
  }
  type Mutation{
    addItem(payload: InputBase!): Item
    addStore(payload: InputBase!): Store
	addGroup(payload: InputBase!): Group
    upsertPurchase(purchase: InputPurchase): Purchase!
    removeItem(id: ID!): Item
	removeStore(id: ID!): Store
	removeGroup(id: ID!): Group
	removePurchase(id: ID!): Purchase
  }
`;

const ss ={ //snapshot
	items: [],
	stores: [],
	purchases: [],
	groups: []
}



const getNextId = set => {
    const ids = set.map(it => +it.id).sort((a,b) => a - b);
    let i = 1;
    while(!isNaN(ids[i]) && ids[i] - ids[i-1] === 1) i++;
    return +ids[i-1] + 1;
}


const frr = (item,field,value) => {
    switch(field){
		case "id_item": case "id_store": case "id_group": case "special":
			return (+item[field] === +value);
        case "dstart":
            return greater(item.date,value)
        case "dend":
            return greater(value,item.date);
		case "price1" :
			if(isNaN(+value)) return false;
			return +item.price >= +value;
		case "price2" :
			if(isNaN(+value)) return false;
			return +item.price <= +value;
		case "count1":
			if(isNaN(+value)) return false;
			return +item.amount >= +value;
		case "count2":
			if(isNaN(+value)) return false;
			return +item.amount <= +value;
		default: return false
	}
}

const sendSet = nameSet => [...current[nameSet]];

const addTo = (args, nameSet) => {
	const {name,id_group} = (args && typeof args.payload === 'object') ? args.payload : null;
	if(!name) return null;
	const existing = current[nameSet].find(it => it.name === name);
    if(existing){
    	if((id_group || !isNaN(+id_group)) && existing.id_group !== current[nameSet].id_group ){
    		existing.id_group = +id_group;
    		current[nameSet] = [...current[nameSet].filter(it => it.id !== existing.id),existing];
		}
		return existing;
	}
    current[nameSet] = [...current[nameSet], {id: getNextId(current[nameSet]), name,id_group: +id_group}];
    return current[nameSet].slice(-1)[0];
}

const removeFrom = (args,nameSet) => {
	const id = (args && typeof args === 'object') ? args.id : null;
	if(+id >= 0 && current[nameSet].find(it => +it.id === +id)){
		const item = current[nameSet].splice(current[nameSet].findIndex(it => it.id === +id),1)[0];
		current[nameSet] = [...current[nameSet]];
		return item;
	}
	return null;
}

const nullish = val => val === null || val === undefined 
const not_provided = val => nullish(val) || +val === -1

const resolvers = {
  Query: {
    getItems:  () => sendSet('items'),
	getStores: () => sendSet('stores'),
	getGroups: () => sendSet('groups'),
	getPurchases: (_,args = {}) => {
		if(!(args && args.filter))
			return current.purchases;
		return current.purchases.filter(pcs => Object.entries(args.filter).map(([key,value]) => frr(pcs,key,value)).reduce((a,b) => a && b,true))
	},
	getDates: (_,args={}) => {
		console.log(args.filter);
		if(args && args.filter){
			const {id_item,id_store,year,month,dstart,dend} = args.filter;
			return [...(new Set(current.purchases
												.filter(pcs => nullish(dstart) || greater(pcs.date,dstart))
												.filter(pcs => nullish(dend) || greater(dend,pcs.date))
												.filter(pcs => not_provided(id_store) || +pcs.id_store === +id_store)
												.filter(pcs => not_provided(id_item) || +pcs.id_item === +id_item)
												.filter(pcs => nullish(year) || +pcs.date.split('-')[0] === year)
												.filter(pcs => nullish(month) || +pcs.date.split('-')[1] === month + 1)
												.map(pcs => pcs.date)))].sort( (a,b) => a > b ? 1 : -1);
 		}
		return [...(new Set(current.purchases.map(pcs => pcs.date)))]
	}
  },
  
    Mutation: {
      addItem:  (_,args = {}) => addTo(args, 'items'),
	  addStore: (_,args = {}) => addTo(args, 'stores'),
	  addGroup: (_,args = {}) => addTo(args, 'groups'),

      upsertPurchase: (_,args = {}) => {
		if(args.purchase && typeof args.purchase === 'object'){
			  const purchase = {...args.purchase,id: +args.purchase.id,id_store: +args.purchase.id_store,id_item: +args.purchase.id_item,id_group: +args.purchase.id_group}
			  if(+purchase.id === -1)
				  purchase.id = getNextId(current.purchases)
			  current.purchases = [...current.purchases.filter(it => +it.id !== +purchase.id), purchase];
			  return purchase;
		  }
		  return null;
          
      },
	  
	  removeItem: 		(_,args = {}) => removeFrom(args, 'items'),
	  removeStore: 		(_,args = {}) => removeFrom(args, 'stores'),
	  removeGroup: 		(_,args = {}) => removeFrom(args, 'groups'),
	  removePurchase: 	(_,args = {}) => removeFrom(args, 'purchases')
    }
}


const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const current ={}
async function loadData(obj){
  return new Promise((resolve,reject) => {
    fs.readFile('./data/' + obj + '.json', (err, data) => {
      if (err)
        reject (err.message);
      ss[obj] = data ? JSON.parse(data.toString()) : [];
      resolve()
    })
  })
}

const registerData = () => {
	Object.keys(current).forEach(set => {
		if(ss[set] !== current[set])
			write(set)
			  .then((_) => console.log(set + " have been updated"))
			  .catch(err => console.log('unable to write ' + set +': ',err));
	})
}

const write = async (name) => {
	fs.writeFileSync('./data/' + name + '.json',JSON.stringify(current[name],null,'\t'))
	ss[name] = current[name];
}

//Promise.all([loadData('items'),loadData('stores'),loadData('purchases')])
Promise.all([...Object.keys(ss).map( key => loadData(key))])
    .then( () => server.listen())
    .then(({ url }) => {
		Object.keys(ss).forEach( key => current[key] = ss[key]);
        //current.items = ss.items;
        //current.stores = ss.stores;
		//current.purchases = ss.purchases;
		console.log(ss.items,ss.stores,ss.groups);
	    setInterval(()=>  registerData() ,3000);
        console.log(`🚀 Server ready at ${url}`);
})

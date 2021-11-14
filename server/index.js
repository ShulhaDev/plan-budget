const fs = require("fs");
const {AuthenticationError} = require("apollo-server-errors");
const {greater} = require("./utils")
const { ApolloServer, gql } = require('apollo-server');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const {secret} = require("./config");

// The GraphQL schema
const typeDefs = gql`

  type UserData{
  	login: String
  	sex: String
  }
  
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
  
  input Credentials{
  	login: String!
  	password: String!
  	sex: String!
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
  	checkToken: UserData
	getItems(filter: Filter): [Item!]  
    getStores: [Store!]
	getGroups: [Group!]
	getPurchases(filter: Filter): [Purchase!]!
	getDates(filter: DatesFilter): [String!]
	signIn(credentials: Credentials!) : String 
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
	registration(credentials: Credentials!) : String
  }
`;

const sets = ['items','stores','purchases','groups']

const ss = { //snapshot
	users: [],
	user: null,
	items: [],
	stores: [],
	purchases: [],
	groups: []
}



const getNextId = set => {
	console.log(set)
	if(!(set && set.length))
		return 0;
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

const sendSet = async (nameSet,user) =>  {
	return user ? [...current[user.login][nameSet]] : null
}


const addTo = (args,nameSet,user) => {
	if(!user)
		return null;
	const login = user.login;
	const {name,id_group} = (args && typeof args.payload === 'object') ? args.payload : null;
	if(!name) return null;
	const existing = current[login][nameSet].find(it => it.name === name);
    if(existing){
    	if((id_group || !isNaN(+id_group)) && existing.id_group !== current[login][nameSet].id_group ){
    		existing.id_group = +id_group;
    		current[login][nameSet] = [...current[login][nameSet].filter(it => it.id !== existing.id),existing];
		}
		return existing;
	}
    current[login] = {...current[login], [nameSet]: [...current[login][nameSet], {id: getNextId(current[login][nameSet]), name,id_group: +id_group}]};
	console.log(current[login][nameSet] === ss[login][nameSet])
    return current[login][nameSet].slice(-1)[0];
}

const removeFrom = (args,nameSet,user) => {
	if(!user)
		return null;
	const login = user.login;
	const id = (args && typeof args === 'object') ? args.id : null;
	if(+id >= 0 && current[login][nameSet].find(it => +it.id === +id)){
		const item = current[login][nameSet].splice(current[login][nameSet].findIndex(it => it.id === +id),1)[0];
		current[login][nameSet] = [...current[login][nameSet]];
		return item;
	}
	return null;
}

const nullish = val => val === null || val === undefined 
const not_provided = val => nullish(val) || +val === -1

const resolvers = {
  Query: {
  	checkToken: (_,__,context) => context.user ? ({login: context.user.login, sex: context.user.sex}) : null,
    getItems:  (_,__,context) => sendSet('items',context.user),
	getStores: (_,__,context) => sendSet('stores',context.user),
	getGroups: (_,__,context) => sendSet('groups',context.user),
	getPurchases: (_,args = {},context) => {
    	const user = context.user;
    	if(!user)
    		return null
		const login = user.login;
		if(!(args && args.filter))
			return current[login].purchases;
		return current[login].purchases.filter(pcs => Object.entries(args.filter).map(([key,value]) => frr(pcs,key,value)).reduce((a,b) => a && b,true))
	},
	getDates: (_,args={},context) => {
		const user = context.user;
    	if(!user)
    		return null;
		const login = user.login;
		if(args && args.filter){
			const {id_item,id_store,year,month,dstart,dend} = args.filter;
			return [...(new Set(current[login].purchases
												.filter(pcs => nullish(dstart) || greater(pcs.date,dstart))
												.filter(pcs => nullish(dend) || greater(dend,pcs.date))
												.filter(pcs => not_provided(id_store) || +pcs.id_store === +id_store)
												.filter(pcs => not_provided(id_item) || +pcs.id_item === +id_item)
												.filter(pcs => nullish(year) || +pcs.date.split('-')[0] === year)
												.filter(pcs => nullish(month) || +pcs.date.split('-')[1] === month + 1)
												.map(pcs => pcs.date)))].sort( (a,b) => a > b ? 1 : -1);
 		}
		return [...(new Set(current[login].purchases.map(pcs => pcs.date)))]
	},
	  signIn:  async(_,args) => {
    	if(!(args && args.credentials))
    		return null;

    	const {login,password} = args.credentials;
		const found = current.users?.find(us => us.login === login && bcrypt.compareSync(password,us.password));
    	if(found){
    		await getData(found);
    		return jwt.sign({login: found.login,roles: [...found.roles],sex: found.sex},secret,{expiresIn: "24h"});
		}
    	else
    		throw "Неверный логин или пароль"
	  }
  },
  
    Mutation: {
		addItem: (_, args = {}, context) => addTo(args, 'items', context.user),
		addStore: (_, args = {}, context) => addTo(args, 'stores', context.user),
		addGroup: (_, args = {}, context) => addTo(args, 'groups', context.user),

		upsertPurchase: (_, args = {}, context) => {
			const user = context.user;
			if (!user)
				return null;
			const login = user.login;
			if (args.purchase && typeof args.purchase === 'object') {
				const purchase = {
					...args.purchase,
					id: +args.purchase.id,
					id_store: +args.purchase.id_store,
					id_item: +args.purchase.id_item,
					id_group: +args.purchase.id_group
				}
				if (+purchase.id === -1)
					purchase.id = getNextId(current[login].purchases)
				current[login].purchases = [...current[login].purchases.filter(it => +it.id !== +purchase.id), purchase];
				return purchase;
			}
			return null;

		},

		removeItem: (_, args = {}, context) => removeFrom(args, 'items', context.user),
		removeStore: (_, args = {}, context) => removeFrom(args, 'stores', context.user),
		removeGroup: (_, args = {}, context) => removeFrom(args, 'groups', context.user),
		removePurchase: (_, args = {}, context) => removeFrom(args, 'purchases', context.user),
		registration: (_, args) => {
			const {login, password,sex} = args.credentials;
			const existing = current.users.find(usr => usr.login === login);
			if (existing)
				throw "Пользователь с таким логином уже существует"
			if (password.length < 3)
				throw "Пароль слишком короткий. Введите минимум три символа"
			current.users = [...current.users,{
				login,
				password: bcrypt.hashSync(password,7),
				roles: ['user'],
				sex
			}]
			if (!fs.existsSync('./data/'+login)){
				fs.mkdirSync('./data/'+login);
			}
			return "Пользователь успешно добавлен";
		}
    }
}


const server = new ApolloServer({
  typeDefs,
  resolvers,
	context: ({ req }) => {
		if(req.body.operationName === 'register' || req.body.operationName === 'signIn')
			return null
		try{
			const token = req.headers.authorization.replace("Bearer ", "") || '';
			const user = jwt.verify(token,secret);
			current.user = user;
			return { user };
		}
		catch(err) {
			return null
			//throw new AuthenticationError('Вы не авторизованы');
		}
	},
});

const current = {}

async function loadData(obj,user){
  return new Promise((resolve,reject) => {
	  if(user && obj !== "user"){
		  fs.readFile('./data/' + user.login + '/' + obj + '.json', (err, data) => {
			  if (err)
				  reject ("Нет данных");
			  if(!current[user.login])
			  	current[user.login] = {};
			  current[user.login][obj] = data ? JSON.parse(data.toString()) : [];
			  resolve()
		  })
	  }
	  else
	  	resolve();

  })
}

const registerData = () => {
	if(current.users !== ss.users){
		fs.writeFileSync('./data/users.json',JSON.stringify(current.users,null,'\t'))
			.then((_) => {
				console.log('Users have been updated');
				ss.users = current.users;
			});
	}

	current.users.forEach(user => {
			sets
				.forEach(name => {
					if(!ss[user.login]
						|| !ss[user.login] === current[user.login]
						|| current[user.login][name] !== ss[user.login][name]) {
						console.log('new',name)
						write(name, user.login)
							.then((_) => console.log(name + " have been updated"))
							.catch(err => console.log('unable to write ' + name + ': ', err))
					}
				})
		ss[user.login] = current[user.login];
	})
}

const write = async (name,login) => {
	fs.writeFileSync('./data/'+ login + '/' + name + '.json',JSON.stringify(current[login][name],null,'\t'))
	if(!ss[login])
		ss[login] = {}
	ss[login][name] = current[login][name];

}
(function loadUsers(){
	try {
		const data = fs.readFileSync('./data/users.json')//, (err, data) => {
		current.users = data ? JSON.parse(data.toString()) : [];
	}
	catch (e){
		console.log(e.message);
	}
})();

const getData = async (user = null) => await Promise.all([...sets.map( key => loadData(key,user))])
												 .catch(err => console.log(err.message))

Promise.all([...current?.users.map(user => getData(user))])
	.then( () => server.listen())
	.then(({ url }) => {
		Object.keys(current).forEach( key => ss[key] = current[key]);
		setInterval(() => registerData() ,3000);
		console.log(`🚀 Server ready at ${url}`);
	})

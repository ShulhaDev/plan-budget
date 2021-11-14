import {ApolloClient, createHttpLink, InMemoryCache} from "@apollo/client";
import {setContext} from "@apollo/client/link/context";

// const client = new ApolloClient({
//   link: new HttpLink({
//     uri: "http://localhost:4000/"
//   }),
//   cache: new InMemoryCache(),
// });


const httpLink = createHttpLink({
  uri: 'http://localhost:4000/',
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});



export {client}

//fetch: async (uri, options) => {
//      const accessToken = await getValidAccessToken();
//      options.headers.Authorization = `Bearer ${accessToken}`;
//      return fetch(uri, options);
//    },
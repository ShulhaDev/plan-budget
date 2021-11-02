import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "http://localhost:4000/"
  }),
  cache: new InMemoryCache(),
});

export {client}

//fetch: async (uri, options) => {
//      const accessToken = await getValidAccessToken();
//      options.headers.Authorization = `Bearer ${accessToken}`;
//      return fetch(uri, options);
//    },
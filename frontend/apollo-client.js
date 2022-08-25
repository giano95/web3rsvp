import { ApolloClient, InMemoryCache, ApolloLink, HttpLink } from "@apollo/client"

// Declare your endpoints
const rinkebyEndpoint = new HttpLink({
    uri: "https://api.thegraph.com/subgraphs/name/giano95/web3rsvp-rinkeby-2",
})
const mumbaiEndpoint = new HttpLink({
    uri: "https://api.thegraph.com/subgraphs/name/giano95/web3rsvp-mumbai-2",
})

const directionalLink = new ApolloLink.split(
    (operation) => operation.getContext().isRinkeby, // condition
    rinkebyEndpoint, // if condition is true
    mumbaiEndpoint // if condition is false
)

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: directionalLink,
})

export default client

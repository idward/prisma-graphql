import ApolloClient from 'apollo-boost'

const getClient = (token) => {
    return new ApolloClient({
        uri: 'http://localhost:4000/graphql',
        request(operation) {
            if(token) {
                return operation.setContext({
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
            }
        }
    })
}

export { getClient as default }
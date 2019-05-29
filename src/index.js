import '@babel/polyfill/noConflict'
import httpServer, { apolloServer } from './server'

httpServer.listen(4000, () => {
    console.log(`Server ready at http://localhost:4000${apolloServer.graphqlPath}`)
    console.log(`Subscriptions ready at ws://localhost:4000${apolloServer.subscriptionsPath}`)
})

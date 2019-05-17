import http from 'http'
import express from 'express'
import { ApolloServer, PubSub } from 'apollo-server-express'
//import cors from 'cors'

import typeDefs from './typedefs'
import resolvers from './resolvers'
import db from './db/data'
import './prisma'

const app = express()
//cors
//app.use(cors())

const pubsub = new PubSub()

const httpServer = http.createServer(app)

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: {
        db,
        pubsub
    }
})

apolloServer.applyMiddleware({ app })
apolloServer.installSubscriptionHandlers(httpServer)

httpServer.listen(4000, () => {
    console.log(`Server ready at http://localhost:4000${apolloServer.graphqlPath}`)
    console.log(`Subscriptions ready at ws://localhost:4000${apolloServer.subscriptionsPath}`)
})

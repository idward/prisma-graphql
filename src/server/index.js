import http from 'http'
import express from 'express'
import { ApolloServer, PubSub } from 'apollo-server-express'
//import cors from 'cors'

import typeDefs from '../typedefs'
import resolvers, { fragmentReplacements } from '../resolvers'
import db from '../db/data'
import prisma from '../prisma'

const app = express()
//cors
//app.use(cors())

const pubsub = new PubSub()

const httpServer = http.createServer(app)

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context(request) {
        const headers = request.req ?
            request.req.headers : request.connection.context;
        return {
            db,
            pubsub,
            prisma,
            headers
        }
    },
    fragmentReplacements
})

apolloServer.applyMiddleware({ app })
apolloServer.installSubscriptionHandlers(httpServer)

export { httpServer as default, apolloServer }
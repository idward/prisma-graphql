import { GraphQLServer, PubSub } from 'graphql-yoga'

//database
import db from './db/data'
//typedefs
import typeDefs from './typedefs'
//resolvers
import resolvers from './resolvers'

const pubsub = new PubSub()

// const opts = {
//     port: '8888',
//     playground: '/graphql'
// }

const server = new GraphQLServer({
    typeDefs,
    resolvers,
    context: {
        db,
        pubsub
    }
})

server.start(({ port, playground }) => {
    console.log(`Server is running on ${port}:${playground}`)
})
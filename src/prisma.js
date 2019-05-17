import { Prisma } from "prisma-binding";
import * as path from 'path'

const prisma = new Prisma({
    typeDefs: path.resolve(__dirname, 'generated', 'prisma.graphql'),
    endpoint: 'https://eu1.prisma.sh/idward/graphql-prisma/dev'
})

prisma.query.users(null, `{ id, name, email }`).then(data => {
    console.log(data)
})
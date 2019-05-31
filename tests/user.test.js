import 'cross-fetch/polyfill'
import ApolloClient, { gql } from 'apollo-boost'
import prisma from '../src/prisma'

const client = new ApolloClient({
    uri: 'http://localhost:4000/graphql'
})

beforeEach(async () => {
    await prisma.mutation.deleteManyUsers()
});

test('should return a user', async () => {
    const createUser = gql`
        mutation {
            createUser(
                data: {
                    name:"idward",
                    email:"idward@vip.sina.com",
                    password:"abc123456"
                }
            ) {
                token
                user {
                    id
                    name
                    email
                }
            }
        }
    `

    const response = await client.mutate({
        mutation: createUser
    })

    const userExisted = await prisma.exists.User({
        id: response.data.createUser.user.id
    })

    expect(userExisted).toBe(true);
    expect(response.data.createUser.user.name).toBe('idward')
});








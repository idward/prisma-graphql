import 'cross-fetch/polyfill'
import { gql } from 'apollo-boost'
import prisma from '../src/prisma'
import seedDatabase, { userOne } from './utils/seedDatabase'
import getClient from './utils/getClient'
import { NoUndefinedVariablesRule } from 'graphql';

const client = getClient()

beforeEach(seedDatabase);

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


test('Should expose a public author profile', async () => {
    const getUsers = gql`
        query {
            users {
                id
                name
                email
            }
        }
    `
    const response = await client.query({ query: getUsers })

    expect(response.data.users.length).toBe(1);
    expect(response.data.users[0].email).toBe(null);
})

test('Should not login with wrong credentials', async () => {
    const loginUser = gql`
        mutation {
            loginUser(
                data: {
                    email:"jacky.ma@alibaba.com",
                    password:"abc223456"
                }
            ){
                token
                user {
                    name
                    email
                }
            }
        }
    `
    await expect(client.mutate({
        mutation: loginUser
    })).rejects.toThrow()
})

test('Should not signup user with wrong password', async () => {
    const signupUser = gql`
        mutation {
            createUser(
                data: {
                    name: "Justin",
                    email: "justin.li@hotmail.cpom",
                    password: "abc123"
                }
            ){
                token
                user {
                    name
                    email
                }
            }
        }
    `

    await expect(client.mutate({
        mutation: signupUser
    })).rejects.toThrow()
})


test('Should return authenticated user info', async () => {
    const client = getClient(userOne.jwt)

    const getCurrentUser = gql`
        query {
            me {
                id
                name
                email
            }
        }
    `

    const response = await client.query({
        query: getCurrentUser
    })

    expect(response.data.me.id).toBe(userOne.user.id)
    expect(response.data.me.name).toBe(userOne.user.name)
    expect(response.data.me.email).toBe(userOne.user.email)
})


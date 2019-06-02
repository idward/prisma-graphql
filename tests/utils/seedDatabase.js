import bycrpt from 'bcryptjs'
import prisma from '../../src/prisma'
import jwt from 'jsonwebtoken'

const userOne = {
    inputData: {
        name: 'jacky',
        email: 'jacky.ma@alibaba.com',
        password: bycrpt.hashSync('abc123456')
    },
    user: undefined,
    jwt: undefined
}

const seedDatabase = async () => {
    //delete users and posts
    await prisma.mutation.deleteManyUsers()
    await prisma.mutation.deleteManyPosts()
    //create a user
    userOne.user = await prisma.mutation.createUser({
        data: userOne.inputData
    })
    //generate jwt token
    userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET)
    //create two post for user
    await prisma.mutation.createPost({
        data: {
            title: 'AAAAAAA',
            body: 'aaaaa',
            published: false,
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    })
    await prisma.mutation.createPost({
        data: {
            title: 'BBBBBB',
            body: 'bbbbb',
            published: true,
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    })
}

export { seedDatabase as default, userOne }
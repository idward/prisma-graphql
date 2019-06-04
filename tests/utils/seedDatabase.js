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

const userTwo = {
    inputData: {
        name: 'sherry',
        email: 'sherry.lin@cookemdical.com',
        password: bycrpt.hashSync('abc123456')
    },
    user: undefined,
    jwt: undefined
}

const postOne = {
    inputData: {
        title: 'AAAAAAA',
        body: 'aaaaa',
        published: false
    },
    post: undefined
}

const postTwo = {
    inputData: {
        title: 'BBBBBB',
        body: 'bbbbb',
        published: true
    },
    post: undefined
}

const commentOne = {
    inputData: {
        text: "Hello world"
    },
    comment: undefined
}

const commentTwo = {
    inputData: {
        text: "Nice day"
    },
    comment: undefined
}

const seedDatabase = async () => {
    //delete users and posts
    await prisma.mutation.deleteManyUsers()
    await prisma.mutation.deleteManyPosts()
    await prisma.mutation.deleteManyComments()
    //create a user
    userOne.user = await prisma.mutation.createUser({
        data: userOne.inputData
    })
    //generate jwt token for userOne
    userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET)
    //create another user
    userTwo.user = await prisma.mutation.createUser({
        data: userTwo.inputData
    })
    //generate jwt token for userTwo
    userTwo.jwt = jwt.sign({ userId: userTwo.user.id }, process.env.JWT_SECRET)
    //create two post for user
    postOne.post = await prisma.mutation.createPost({
        data: {
            ...postOne.inputData,
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    })
    postTwo.post = await prisma.mutation.createPost({
        data: {
            ...postTwo.inputData,
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    })

    commentOne.comment = await prisma.mutation.createComment({
        data: {
            ...commentOne.inputData,
            post: {
                connect: {
                    id: postOne.post.id
                }
            },
            author: {
                connect: {
                    id: userTwo.user.id
                }
            }
        }
    })

    commentTwo.comment = await prisma.mutation.createComment({
        data: {
            ...commentTwo.inputData,
            post: {
                connect: {
                    id: postOne.post.id
                }
            },
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    })
}

export { seedDatabase as default, userOne, userTwo, postOne, postTwo, commentOne, commentTwo }
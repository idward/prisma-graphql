import { Prisma } from "prisma-binding";
import * as path from 'path'
import { fragmentReplacements } from './resolvers'

const prisma = new Prisma({
    typeDefs: path.resolve(__dirname, 'generated', 'prisma.graphql'),
    endpoint: process.env.PRISMA_ENDPOINT,
    secret: 'thisismysuperscret',
    fragmentReplacements
})


export { prisma as default }

// prisma.query.users(null, `{ id, name, email }`).then(data => {
//     console.log(data)
// })

// const createPostForUser = async (authorId, data) => {
//     const userExisted = await prisma.exists.User({
//         id: authorId
//     })

//     if (!userExisted) {
//         throw new Error('User not found')
//     }

//     const post = await prisma.mutation.createPost({
//         data: {
//             ...data,
//             author: {
//                 connect: {
//                     id: authorId
//                 }
//             }
//         }
//     }, '{author {id name email posts {id title}}}')

//     // const user = await prisma.query.user({
//     //     where: {
//     //         id: authorId
//     //     }
//     // }, '{id name email posts {id title}}')

//     return post.author
// }

// createPostForUser('cjvps1u1jmzq40b958b7lgnca', {
//     title: 'Hello Morning11111',
//     body: 'nice day and have a beatiful emotion',
//     published: false
// }).then(data => {
//     console.log(JSON.stringify(data, undefined, 2))
// }).catch(err => {
//     console.log(err)
// })

// const updatePostForUser = async (postId, data) => {
//     const postExisted = await prisma.exists.Post({
//         id: postId
//     })

//     if (!postExisted) {
//         throw new Error('Post not found')
//     }

//     const post = await prisma.mutation.updatePost({
//         data: {
//             ...data
//         },
//         where: {
//             id: postId
//         }
//     }, '{author {id name email posts {id title}}}')

//     // const user = await prisma.query.user({
//     //     where: {
//     //         id: post.author.id
//     //     }
//     // }, '{id posts {id,title}}')

//     return post.author
// }

// updatePostForUser('cjvrt1qd3bdct0b95fxfjujjs', {
//     title: 'AAAAA3333',
//     published: false
// }).then(data => {
//     console.log(JSON.stringify(data, undefined, 2))
// }).catch(err => {
//     console.log(err)
// })

// const createCommentForUser = async (postId, authorId, data) => {
//     const postExisted = await prisma.exists.Post({
//         id: postId
//     })

//     if (!postExisted) {
//         throw new Error('Post not found')
//     }

//     const userExisted = await prisma.exists.User({
//         id: authorId
//     })

//     if (!userExisted) {
//         throw new Error('User not found')
//     }

//     const comment = await prisma.mutation.createComment({
//         data: {
//             ...data,
//             author: {
//                 connect: {
//                     id: authorId
//                 }
//             },
//             post: {
//                 connect: {
//                     id: postId
//                 }
//             }
//         }
//     }, '{author {id name email comments {id text}}}')

//     return comment.author
// }

// createCommentForUser('cjvri77v37sr70b95lpgow857', 'cjvrb46ai5sbx0b95gce1dlf8', {
//     text: 'retwesdgfs'
// }).then(data => {
//     console.log(JSON.stringify(data, undefined, 2))
// }).catch(err => {
//     console.log(err)
// })
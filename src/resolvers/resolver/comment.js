import v4 from 'uuid/v4'

import getUserId from '../../utils/getUserId'

export default {
    Query: {
        comments(parent, args, { prisma }, info) {
            const opArgs = {}

            if (args.query) {
                opArgs.where = {
                    text_contains: args.query
                }
            }

            if (args.first) {
                opArgs.first = args.first
            }

            if (args.skip) {
                opArgs.skip = args.skip
            }

            if (args.after) {
                opArgs.after = args.after
            }

            return prisma.query.comments(opArgs, info)
        }
    },
    Mutation: {
        async createComment(parent, args, { prisma, headers }, info) {
            const userId = getUserId(headers)

            const postExisted = await prisma.exists.Post({
                id: args.data.post,
                published: true
            })

            if (!postExisted) {
                throw new Error('Post not found')
            }

            return prisma.mutation.createComment({
                data: {
                    text: args.data.text,
                    author: {
                        connect: {
                            id: userId
                        }
                    },
                    post: {
                        connect: {
                            id: args.data.post
                        }
                    }
                }
            }, info)
        },
        async updateComment(parent, { id, data }, { prisma, headers }, info) {
            const userId = getUserId(headers)

            //check comment is existed
            const commentExisted = await prisma.exists.Comment({
                id,
                auhtor: {
                    id: userId
                }
            })

            if (!commentExisted) {
                throw new Error('Comment not found')
            }

            return prisma.mutation.updateComment({
                data,
                where: { id }
            }, info)
        },
        async deleteComment(parent, args, { prisma, headers }, info) {
            const userId = getUserId(headers)

            //check comment is existed
            const commentExisted = await prisma.exists.Comment({
                id: args.id,
                author: {
                    id: userId
                }
            })

            if (!commentExisted) {
                throw new Error('Comment not found')
            }

            return prisma.mutation.deleteComment({
                where: {
                    id: args.id
                }
            }, info)
        }
    },
    Comment: {
        // author(parent, args, { db }, info) {
        //     return db.users.find(user => {
        //         return user.id === parent.author
        //     })
        // },
        // post(parent, args, { db }, info) {
        //     return db.posts.find(post => {
        //         return post.id === parent.post
        //     })
        // }
    }
}
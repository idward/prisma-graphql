import v4 from 'uuid/v4'
import jwt from 'jsonwebtoken'

import getUserId from '../../utils/getUserId'

export default {
    Query: {
        posts(parent, args, { prisma }, info) {
            const opArgs = {
                where: {
                    published: true
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

            if (args.query) {
                opArgs.where.OR = [{
                    title_contains: args.query
                }, {
                    body_contains: args.query
                }]
            }

            return prisma.query.posts(opArgs, info)
        },
        myPosts(parent, args, { prisma, headers }, info) {
            const userId = getUserId(headers)

            const opArgs = {
                where: {
                    author: {
                        id: userId
                    }
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

            if (args.query) {
                opArgs.where.OR = [{
                    title_contains: args.query
                }, {
                    body_contains: args.query
                }]
            }

            return prisma.query.posts(opArgs, info)
        },
        async post(parent, args, { prisma, headers }, info) {
            const userId = getUserId(headers, false)

            const posts = await prisma.query.posts({
                where: {
                    id: args.id,
                    OR: [{
                        published: true
                    }, {
                        author: {
                            id: userId
                        }
                    }]
                }
            }, info)

            if (posts.length === 0) {
                throw new Error('Post not found')
            }

            return posts[0]
        }
    },
    Mutation: {
        async createPost(parent, args, { prisma, headers }, info) {
            const userId = getUserId(headers)

            return prisma.mutation.createPost({
                data: {
                    title: args.data.title,
                    body: args.data.body,
                    published: args.data.published,
                    author: {
                        connect: {
                            id: userId
                        }
                    }
                }
            }, info)
        },
        async updatePost(parent, { id, data }, { prisma, headers }, info) {
            const userId = getUserId(headers)
            //check post is existed
            const postExisted = await prisma.exists.Post({
                id,
                author: {
                    id: userId
                }
            })

            const isPublished = await prisma.exists.Post({
                id,
                published: true
            })

            if (!postExisted) {
                throw new Error('Post not found')
            }

            if (isPublished && !data.published) {
                await prisma.mutation.deleteManyComments({
                    where: {
                        post: {
                            id
                        }
                    }
                })
            }

            return prisma.mutation.updatePost({
                data,
                where: { id }
            }, info)
        },
        async deletePost(parent, args, { prisma, headers }, info) {
            const userId = getUserId(headers)

            //check post is existed
            const postExisted = await prisma.exists.Post({
                id: args.id,
                author: {
                    id: userId
                }
            })

            if (!postExisted) {
                throw new Error('Post not found')
            }

            return prisma.mutation.deletePost({
                where: {
                    id: args.id
                }
            }, info)
        }
    },
    Post: {
        // author: {
        //     resolve(parent, args, { prisma }, info) {
        //         return prisma.query.users({
        //             where: {
        //                 post_none: {
        //                     id: parent.id
        //                 }
        //             }
        //         }, info)
        //     },
        // }
        // comments(parent, args, { db }, info) {
        //     return db.comments.filter(comment => {
        //         return comment.post === parent.id
        //     })
        // }
    }
}
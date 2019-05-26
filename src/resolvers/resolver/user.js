import v4 from 'uuid/v4'
import bcrypt from 'bcryptjs'
import generateToken from '../../utils/generateToken'
import hashPassword from '../../utils/hashPassword'

import getUserId from '../../utils/getUserId'

export default {
    Query: {
        users(parent, args, { prisma }, info) {
            const opArgs = {}
            //pagination start
            if (args.first) {
                opArgs.first = args.first
            }

            if (args.skip) {
                opArgs.skip = args.skip
            }

            if (args.after) {
                opArgs.after = args.after
            }
            //pagination end
            if (args.query) {
                opArgs.where = {
                    AND: [
                        { name_contains: args.query },
                        { email_contains: args.query }
                    ]
                }
            }
            //sort by field
            if(args.orderBy) {
                opArgs.orderBy = args.orderBy
            }

            return prisma.query.users(opArgs, info)
        },
        me(parent, args, { prisma, headers }, info) {
            const userId = getUserId(headers)

            return prisma.query.user({
                where: {
                    id: userId
                }
            }, info)
        }
    },
    Mutation: {
        async createUser(parent, args, { prisma }, info) {
            // const emailTaken = await prisma.exists.User({
            //     email: args.data.email
            // })
            // if (emailTaken) {
            //     throw new Error('email taken')
            // }

            //check password length must be more than 8 digit
            const password = await hashPassword(args.data.password)

            const user = prisma.mutation.createUser({
                data: {
                    ...args.data,
                    password
                }
            })

            return {
                user,
                token: generateToken(user.id)
            }
        },
        async loginUser(parent, args, { prisma }, info) {
            const user = await prisma.query.user({
                where: {
                    email: args.data.email
                }
            })

            if (!user) {
                throw new Error('User not found')
            }

            //compare password is matched
            const isMatched = await bcrypt.compare(args.data.password, user.password)

            if (!isMatched) {
                throw new Error('User not found')
            }

            return {
                user,
                token: generateToken(user.id)
            }
        },
        async updateUser(parent, { id, data }, { prisma, headers }, info) {
            // const userExisted = prisma.exists.User({ id })

            // if (!userExisted) {
            //     throw new Error('User not found')
            // }

            const userId = getUserId(headers)

            if (data.password && typeof data.password === 'string') {
                data.password = await hashPassword(data.password)
            }

            return prisma.mutation.updateUser({
                data,
                where: { id: userId }
            }, info)
        },
        async deleteUser(parent, args, { prisma, headers }, info) {
            // const userExisted = await prisma.exists.User({
            //     id: args.id
            // })
            // if (!userExisted) {
            //     throw new Error('User not found')
            // }

            const userId = getUserId(headers)

            return prisma.mutation.deleteUser({
                where: {
                    id: userId
                }
            }, info)
        }
    },
    User: {
        email: {
            fragment: 'fragment userId on User { id }',
            resolve(parent, args, { headers }, info) {
                const userId = getUserId(headers, false)

                if (userId && userId === parent.id) {
                    return parent.email
                } else {
                    return null
                }
            }
        },
        posts: {
            fragment: 'fragment userId on User { id }',
            resolve(parent, args, { prisma }, info) {
                return prisma.query.posts({
                    where: {
                        published: true,
                        author: {
                            id: parent.id
                        }
                    }
                }, info)
            }
        }
        // comments(parent, args, { db }, info) {
        //     return db.comments.filter(comment => {
        //         return comment.author === parent.id
        //     })
        // }
    }
}
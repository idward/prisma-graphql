import v4 from 'uuid/v4'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import getUserId from '../../utils/getUserId'

export default {
    Query: {
        users(parent, args, { prisma }, info) {
            let opArgs = {}

            if (args.query) {
                opArgs = {
                    where: {
                        AND: [
                            { name_contains: args.query },
                            { email_contains: args.query }
                        ]
                    }
                }
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
            if (args.data.password.length < 8) {
                throw new Error('Password must not be less than 8 characters')
            }

            const password = await bcrypt.hash(args.data.password, 10)

            const user = prisma.mutation.createUser({
                data: {
                    ...args.data,
                    password
                }
            })

            return {
                user,
                token: jwt.sign({ userId: user.id }, 'mysecret')
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
                token: jwt.sign({ userId: user.id }, 'mysecret')
            }
        },
        async updateUser(parent, { id, data }, { prisma, headers }, info) {
            // const userExisted = prisma.exists.User({ id })

            // if (!userExisted) {
            //     throw new Error('User not found')
            // }

            const userId = getUserId(headers)

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
        }
        // posts(parent, args, { prisma }, info) {
        //     return prisma.query.posts({
        //         where: {
        //             author: {
        //                 id: parent.id
        //             }
        //         }
        //     }, info)
        // },
        // comments(parent, args, { db }, info) {
        //     return db.comments.filter(comment => {
        //         return comment.author === parent.id
        //     })
        // }
    }
}
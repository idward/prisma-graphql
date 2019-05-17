import v4 from 'uuid/v4'

export default {
    Query: {
        users(parent, args, { db }, info) {
            if (!args.query) {
                return db.users
            }
            return db.users.filter(user => {
                return user.name.toLowerCase().includes(args.query.toLowerCase())
            })
        }
    },
    Mutation: {
        createUser(parent, args, { db }, info) {
            const emailTaken = db.users.some(user => {
                return user.email === args.data.email
            })
            if (emailTaken) {
                throw new Error('email taken')
            }
            const newUser = {
                id: v4(),
                ...args.data
            }

            db.users.push(newUser)
            return newUser
        },
        updateUser(parent, { id, data }, { db }, info) {
            const user = db.users.find(user => user.id === id)

            if (!user) {
                throw new Error('User not found')
            }
            if (data.name) {
                user.name = data.name
            }
            if (data.email) {
                const emailTaken = db.users.some(user => user.email === data.email)
                if (emailTaken) {
                    throw new Error('Email taken')
                }
                user.email = data.email
            }
            if (data.age) {
                user.age = data.age
            }

            return user
        },
        deleteUser(parent, args, { db }, info) {
            const delUserIndex = db.users.findIndex(user => user.id === args.id)
            if (delUserIndex === -1) {
                throw new Error('User not found')
            }
            //return deleted user
            let deletedUser = db.users.splice(delUserIndex, 1)[0]
            deletedUser.posts = []
            deletedUser.comments = []

            //delete related post and comment
            db.posts = db.posts.filter(post => {
                if (post.author === args.id) {
                    deletedUser.posts.push(post)
                    db.comments = db.comments.filter(comment => comment.post !== post.id)
                }
                return post.author !== args.id
            })
            db.comments = db.comments.filter(comment => {
                if (comment.author === args.id) {
                    deletedUser.comments.push(comment)
                }
                return comment.author !== args.id
            })

            console.log(deletedUser)

            return deletedUser
        }
    },
    User: {
        posts(parent, args, { db }, info) {
            return db.posts.filter(post => {
                return post.author === parent.id
            })
        },
        comments(parent, args, { db }, info) {
            return db.comments.filter(comment => {
                return comment.author === parent.id
            })
        }
    }
}
import v4 from 'uuid/v4'

export default {
    Query: {
        posts(parent, args, { db }, info) {
            if (!args.query) {
                return db.posts
            }

            return db.posts.filter(post => {
                const isMatchTitle = post.title.toLocaleLowerCase().includes(args.query.toLowerCase())
                const isMatchBody = post.body.toLocaleLowerCase().includes(args.query.toLowerCase())

                return isMatchTitle || isMatchBody
            })
        }
    },
    Mutation: {
        createPost(parent, args, { db, pubsub }, info) {
            const userExisted = db.users.some(user => {
                return user.id === args.data.author
            })
            if (!userExisted) {
                throw new Error('User not found')
            }

            const newPost = {
                id: v4(),
                ...args.data
            }

            db.posts.push(newPost)

            if (newPost.published) {
                pubsub.publish('post', {
                    post: { mutation: 'CREATED', data: newPost }
                })
            }

            return newPost
        },
        updatePost(parent, { id, data }, { db }, info) {
            const post = db.posts.find(post => post.id === id)
            if (!post) {
                throw new Error('Post not found')
            }
            if (data.title) {
                post.title = data.title
            }
            if (data.body) {
                post.body = data.body
            }
            if (typeof data.published !== 'undefined') {
                post.published = data.published
            }

            pubsub.publish('post', {
                post: {
                    mutation: 'UPDATED',
                    data: post
                }
            })

            return post
        },
        deletePost(parent, args, { db, pubsub }, info) {
            const delPostIndex = db.posts.findIndex(post => post.id === args.id)

            if (delPostIndex === -1) {
                throw new Error('Post not found')
            }
            const deletedPost = db.posts.splice(delPostIndex, 1)[0]
            //delete comment
            db.comments = db.comments.filter(comment => comment.post !== args.id)

            if (deletedPost.published) {
                pubsub.publish('post', {
                    post: { mutation: 'DELETED', data: deletedPost }
                })
            }

            return deletedPost
        }
    },
    Post: {
        author(parent, args, { db }, info) {
            return db.users.find(user => {
                return user.id === parent.author
            })
        },
        comments(parent, args, { db }, info) {
            return db.comments.filter(comment => {
                return comment.post === parent.id
            })
        }
    }
}
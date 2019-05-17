import v4 from 'uuid/v4'

export default {
    Query: {
        comments(parent, args, { db }, info) {
            return db.comments
        }
    },
    Mutation: {
        createComment(parent, args, { db, pubsub }, info) {
            const userExisted = db.users.some(user => {
                return user.id === args.data.author
            })
            if (!userExisted) {
                throw new Error('User not found')
            }
            const postExisted = db.posts.some(p => {
                return p.id === args.data.post && p.published
            })
            if (!postExisted) {
                throw new Error('Post not found')
            }
            const newComment = {
                id: v4(),
                ...args.data
            }

            db.comments.push(newComment)
            //emit publish event
            pubsub.publish(`comment ${args.data.post}`, {
                comment: {
                    mutation: 'CREATED',
                    data: newComment
                }
            })

            return newComment
        },
        updateComment(parent, { id, data }, { db, pubsub }, info) {
            const comment = db.comments.find(comment => comment.id === id)
            if (!comment) {
                throw new Error('Comment not found')
            }
            if (data.text) {
                comment.text = data.text
            }

            pubsub.publish(`comment ${comment.post}`, {
                comment: {
                    mutation: 'UPDATED',
                    data: comment
                }
            })

            return comment
        },
        deleteComment(parent, args, { db, pubsub }, info) {
            const delCommentIndex = db.comments.findIndex(comment => comment.id === args.id)

            if (delCommentIndex === -1) {
                throw new Error('Comment not found')
            }
            const deletedComment = db.comments.splice(delCommentIndex, 1)[0]

            pubsub.publish(`comment ${deletedComment.post}`, {
                comment: {
                    mutation: 'DELETED',
                    data: deletedComment
                }
            })

            return deletedComment
        }
    },
    Comment: {
        author(parent, args, { db }, info) {
            return db.users.find(user => {
                return user.id === parent.author
            })
        },
        post(parent, args, { db }, info) {
            return db.posts.find(post => {
                return post.id === parent.post
            })
        }
    }
}
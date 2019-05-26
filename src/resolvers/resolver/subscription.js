import getUserId from '../../utils/getUserId'

export default {
    Subscription: {
        comment: {
            subscribe(parent, { postId }, { prisma }, info) {
                return prisma.subscription.comment({
                    where: {
                        node: {
                            post: {
                                id: postId
                            }
                        }
                    }
                }, info)
            }
        },
        post: {
            subscribe(parent, args, { prisma }, info) {
                return prisma.subscription.post({
                    where: {
                        node: {
                            published: true
                        }
                    }
                }, info)
            }
        },
        myPost: {
            subscribe(parent, args, { prisma, headers }, info) {
                const userId = getUserId(headers)

                return prisma.subscription.post({
                    where: {
                        node: {
                            author: {
                                id: userId
                            }
                        }
                    }
                }, info)
            }
        }
    }
}
import 'cross-fetch/polyfill'
import { gql } from 'apollo-boost'
import prisma from '../src/prisma'
import seedDatabase, { userOne, commentTwo } from './utils/seedDatabase'
import getClient from './utils/getClient'

beforeEach(seedDatabase)

test('Should delete own comment', async () => {
    const client = getClient(userOne.jwt)

    const deleteComment = gql`
        mutation($id:ID!) {
            deleteComment(
                id: $id
            ) {
                id
            }
        }
    `

    const variables = {
        id: commentTwo.comment.id
    }

    await client.mutate({
        mutation: deleteComment,
        variables
    })

    const commentExisted = await prisma.exists.Comment({
        id: commentTwo.comment.id
    })

    expect(commentExisted).toBe(false)
})

test('Should not delete other user\'s comment', () => {

})
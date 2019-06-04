import 'cross-fetch/polyfill'
import { gql } from 'apollo-boost'
import seedDatabase, { userOne, postOne, postTwo } from './utils/seedDatabase'
import getClient from './utils/getClient'
import prisma from '../src/prisma'

const client = getClient()

beforeEach(seedDatabase)

test('Should expose published post', async () => {
    const getPosts = gql`
        query {
            posts {
                id
                title
                body
                published
            }
        }
    `

    const response = await client.query({
        query: getPosts
    });

    expect(response.data.posts.length).toBe(1)
    expect(response.data.posts[0].published).toBe(true)
})

test('Should return user\'s posts', async () => {
    const client = getClient(userOne.jwt)
    const myPosts = gql`
        query {
            myPosts {
                id
                title
                body
                published
            }
        }
    `

    const response = await client.query({
        query: myPosts
    })

    expect(response.data.myPosts.length).toBe(2);
})

test('Should update own post profile', async () => {
    const client = getClient(userOne.jwt)

    const updateMyPost = gql`
        mutation($id:ID!, $data:UpdatePostInput!) {
            updatePost(
               id: $id,
               data: $data
            ){
                id
                title
                body
                published
            }
        }
    `

    const variables = {
        id: postOne.post.id,
        data: {
            published: true
        }
    }

    const response = await client.mutate({
        mutation: updateMyPost,
        variables
    })

    const postExisted = await prisma.exists.Post({
        id: response.data.updatePost.id,
        published: true
    })

    expect(response.data.updatePost.published).toBe(true);
    expect(postExisted).toBe(true);
})

test('Should create a new post', async () => {
    const client = getClient(userOne.jwt)

    const createPost = gql`
        mutation($data:CreatePostInput!) {
            createPost(
                data: $data
            ){
                id
                title
                body
                published
            }
        }
    `

    const variables = {
        data: {
            title: "A test post",
            body: "",
            published: true
        }
    }

    const response = await client.mutate({
        mutation: createPost,
        variables
    })

    expect(response.data.createPost.title).toBe('A test post');
    expect(response.data.createPost.body).toBe('');
    expect(response.data.createPost.published).toBe(true);
})

test('Should delete a post', async () => {
    const client = getClient(userOne.jwt)

    const deletePost = gql`
        mutation($id:ID!) {
            deletePost(
                id: $id
            ){
                id
                title
                body
                published
            }
        }
    `

    const variables = {
        id: postTwo.post.id
    }

    const response = await client.mutate({
        mutation: deletePost,
        variables
    })

    const postExisted = await prisma.exists.Post({
        id: response.data.deletePost.id
    })

    expect(postExisted).toBe(false)
})
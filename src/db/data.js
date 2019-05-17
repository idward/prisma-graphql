const users = [
    {
        id: 'u001',
        name: 'Jacky',
        email: 'jacky@163.com',
        age: 32
    },
    {
        id: 'u002',
        name: 'Mary',
        email: 'mary@sina.com'
    },
    {
        id: 'u003',
        name: 'Justin',
        email: 'justin@gmail.com'
    }
]

const posts = [
    {
        id: 'p001',
        title: 'React is most popular framework',
        body: 'produced by facebook corp.',
        published: true,
        author: 'u001'
    },
    {
        id: 'p002',
        title: 'Angular is the second popular framework',
        body: 'produced by google corp.',
        published: true,
        author: 'u002'
    },
    {
        id: 'p003',
        title: 'React-router is the navigation system in React',
        body: 'advanced characters in react',
        published: true,
        author: 'u001'
    }
]

const comments = [
    {
        id: 'c102',
        text: 'This works well for me, Thanks',
        author: 'u001',
        post: 'p001'
    },
    {
        id: 'c103',
        text: 'Glad you enjoyed it',
        author: 'u002',
        post: 'p002'
    },
    {
        id: 'c104',
        text: 'This did not work',
        author: 'u003',
        post: 'p003'
    },
    {
        id: 'c105',
        text: 'Never mind! I will get it worked',
        author: 'u001',
        post: 'p001'
    }
]

const db = {
    users,
    posts,
    comments
}

export {db as default}
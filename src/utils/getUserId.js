import jwt from 'jsonwebtoken'

const getUserId = (headers, requireAuth = true) => {
    console.log(headers);
    const authorization = headers.authorization

    if (!authorization && requireAuth) {
        throw new Error('Authorization Required')
    }

    if (authorization) {
        const token = authorization.split(' ')[1]
        //return payload {userId: XXX}
        const { userId } = jwt.verify(token, 'mysecret')
        return userId
    } else {
        return null
    }
}

export { getUserId as default }
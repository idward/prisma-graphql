import jwt from 'jsonwebtoken'

const getUserId = (headers, requireAuth = true) => {
    // console.log(headers);
    const authorization = headers.authorization || headers.Authorization;

    if (!authorization && requireAuth) {
        throw new Error('Authorization Required')
    }

    if (authorization) {
        const token = authorization.split(' ')[1]
        //return payload {userId: XXX}
        const { userId } = jwt.verify(token, process.env.JWT_SECRET)
        return userId
    } else {
        return null
    }
}

export { getUserId as default }
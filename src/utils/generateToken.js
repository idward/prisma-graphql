import jwt from 'jsonwebtoken'

function generateToken(userId) {
    return jwt.sign({ userId }, 'mysecret', { expiresIn: '2 hour' })
}

export { generateToken as default }
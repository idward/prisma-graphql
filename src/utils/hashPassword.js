import bcrypt from 'bcryptjs'

function hashPassword(password) {
    if (password.length < 8) {
        throw new Error('Password must not be less than 8 characters')
    }

    return bcrypt.hash(password, 10)
}

export { hashPassword as default }
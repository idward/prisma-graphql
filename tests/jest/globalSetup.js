require('babel-register')
require('@babel/polyfill/noConflict')
const server = require('../../src/server').default

module.exports = async () => {
    await server.listen(4000)
}
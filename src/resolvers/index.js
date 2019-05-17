import * as path from 'path'
import { fileLoader, mergeResolvers } from 'merge-graphql-schemas'

const resolverArrays = fileLoader(path.resolve(__dirname, 'resolver'), { recursive: true })
const resolverMerged = mergeResolvers(resolverArrays)

export { resolverMerged as default }
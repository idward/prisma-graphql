import * as path from 'path'
import { fileLoader, mergeResolvers } from 'merge-graphql-schemas'
import {extractFragmentReplacements} from 'prisma-binding'

const resolverArrays = fileLoader(path.resolve(__dirname, 'resolver'), { recursive: true })
const resolverMerged = mergeResolvers(resolverArrays)

const fragmentReplacements = extractFragmentReplacements(resolverMerged)

export { resolverMerged as default, fragmentReplacements }
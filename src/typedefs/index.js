import * as path from 'path'
import { fileLoader, mergeTypes } from 'merge-graphql-schemas'

const typeArrays = fileLoader(path.resolve(__dirname, 'types'), { recursive: true })
const typeMerged = mergeTypes(typeArrays)

export { typeMerged as default }
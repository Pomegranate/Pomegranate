/**
 * @file helpers
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {compose, first, get, initial, join, last, memoize, startsWith, tail, curry} from 'lodash/fp'
import {append} from "../Common/ArrayMethods";

export const getName = get('computedMetadata.name')
export const getDirectories = get('state.directories')
export const getParents = get('loadMetadata.parents')
export const getNamespace = get('loadMetadata.namespace')
export const hasParents = (parents) => {
  return !!(parents.length)
}

export const getFqn = get('computedMetadata.fqn')

export const fqDeclaredName = memoize((fqn: string[]): string => {
  return last(fqn)
})

export const fqShortName = memoize((fqn: string[]) => {
  let ns = first(fqn)
  return (startsWith('@', ns) ? [ns, last(fqn)] : [last(fqn)])
})

export const fqParentName = memoize((fqn: string[]) => {
  let ns = first(fqn)
  return (startsWith('@', ns) ? [ns, fqn[1]] : [fqn[0]])
})
export const joinFqParentname = compose(join('/'), fqParentName)
export const joinFqShortname = compose(join('/'), fqShortName)

export const getFqParentname = compose(joinFqParentname, getFqn)
export const getFqShortname = compose(joinFqShortname, getFqn)

export const fqLineage = memoize((fqn) => {
  return initial(fqn)
})

export const hasDirectories = (plugin) => {
  return !!(getDirectories(plugin).length)
}

export const directoryBasePath = (plugin) => {
  return join('/', getName(plugin))
}

export const configObjectPath = curry((plugin, appendPath) => {
  let parents = getParents(plugin)
  // return hasParents(parents) ? append([...tail(parents), last(plugin.configuration.name)]) : append([])
  return append((hasParents(parents) ? [...tail(parents), last(plugin.computedMetadata.name)] : []), [appendPath]).join('.')
})

export const configPath = (plugin) => {
 let parents = getParents(plugin)
  return (hasParents(parents) ? [...tail(parents), last(plugin.state.configuration.name)] : [])
}

export const getConfigFilePath = (plugin): string => {
  let Parents = get('loadMetadata.parents', plugin)
  let BaseFile: string = Parents.length ? first(Parents) : fqDeclaredName(plugin.computedMetadata.name)
  let Namespace = get('loadMetadata.namespace', plugin)
  return Namespace ? `${Namespace}/${BaseFile}` : BaseFile
}


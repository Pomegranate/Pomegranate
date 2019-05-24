/**
 * @file index
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {compose, filter, map, includes, first, concat} from "lodash/fp";
import {ValidatedPlugin} from "../Plugin";
import {getFqShortname} from "../Plugin/helpers";

const missingDep = (plugin): [string, string[]] => {
  return [plugin.configuration.name, plugin.missingDependencies]
}
const removeEmpty = ([name, missing]) => {
  return missing.length
}


export const findMissingDeps = compose(filter(removeEmpty), map(missingDep))


const providesDep = (plugin) => {
  return [getFqShortname(plugin), plugin.state.configuration.provides]
}

export const getProvidingPlugins = compose(filter(removeEmpty), map(providesDep))


const filterMatching = (dep: string): any => {
  return ([src, deps]) => {
    return includes(dep, deps)
  }
}

const mapProviders = ([provider, rest]) => {
  return provider
}

export const provideDependencies = (name: string, depends: string[], providingDepends) => {

  let f = compose(concat(depends),map(mapProviders), filter(([src, deps]: [string, string[]]) => includes(name, deps)));
  return f(providingDepends)
}
/**
 * @file RequirePlugins
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {discoverFramework, discoverLocal, discoverNamespaced} from "./discoverPlugins";
import {Plugin as AddUtilities} from "./FrameworkPlugins/AddUtilities";
import {
  compose,
  concat,
  filter,
  flattenDeep,
  fromPairs,
  get,
  includes,
  map,
  split,
  startsWith,
  toPairs
} from "lodash/fp";
import {ValidatedConfiguration} from "./Configuration";
import {LogManager} from "./FrameworkLogger/LogManager";

const startsWithAt = startsWith('@')
const getNamespace = mod => startsWithAt(mod) ? split('/', mod)[0] : null

// No longer - Adds @pomOfficial to the namespace search list if it is missing.
let normalizeNamespaces = compose(
  map((ns: string) => {
    return startsWithAt(ns) ? ns : `@${ns}`
  }),
  get('pluginNamespaces')
)


const filterNamespaces = namespaces => compose(
  fromPairs,
  filter(([module, version]: [string, string]) => {
    let ns = getNamespace(module)
    return ns && includes(ns, namespaces)
  }),
  toPairs,
  get('pkgDependencies')
)

export async function RequirePlugins(pomConfig: ValidatedConfiguration, LogManager: LogManager) {
  let frameworkPlugins = await discoverFramework([AddUtilities.getPlugin().state])
  LogManager.use('pomegranate').log(`Found ${frameworkPlugins.length} framework plugins.`)

  let namespaces = normalizeNamespaces(pomConfig)

  LogManager.use('pomegranate').log(`Loading namespaced plugins from ${namespaces.join(', ')}.`)

  // Extract only the plugins with namespaces in config.pluginNamespaces
  let namespaceFilter = filterNamespaces(namespaces)
  let nsdeps = namespaceFilter(pomConfig)

  let externalNamespaced = await discoverNamespaced(nsdeps)
  LogManager.use('pomegranate').log(`Found ${externalNamespaced.length} namespaced plugins.`)

  let localPlugins = await discoverLocal(get('pluginDirectory', pomConfig))
  LogManager.use('pomegranate').log(`Found ${localPlugins.length} local plugins.`)


  return flattenDeep(concat(frameworkPlugins, [externalNamespaced, localPlugins]))
}

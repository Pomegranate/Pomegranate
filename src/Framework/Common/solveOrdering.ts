/**
 * @file solveOrdering
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {Topological} from "./Topological";
import {compose, each, filter, flatten, groupBy, map, getOr, get, keyBy, isObject, isArray, negate, some, fromPairs} from "lodash/fp";
import {getFqShortname} from "../Plugin/helpers";

const getInjectableParam = get('state.configuration.injectableParam')
const getName = getFqShortname
const getDepends = getOr([], 'state.configuration.depends')
const getOptional = getOr([], 'state.configuration.optional')
const getProvides = getOr([], 'state.configuration.provides')

const extractDeps = map((p: any) => {
  if(getInjectableParam(p)){
    return {injectableParam: getInjectableParam(p), name: getName(p)}
  }
  return false
})

const groupByParams = compose(groupBy('injectableParam'),filter<any>(Boolean),extractDeps)



const generateDeps = (grouped) => compose(
  flatten,
  map((p: string) => {
    if(grouped[p]){
      return map((inj: any) => {
        return inj.name
      }, grouped[p])
    }
    return p
  }))

const extractPluginOrder = (plugins) => {
  let keyedPlugins = keyBy(getFqShortname, plugins)
  let mapFn = map((key: string) => {
    return keyedPlugins[key]
  })
  //@ts-ignore
  return compose(map(getFqShortname),filter(isObject), mapFn )
}

const getFramework = p => p.state.configuration.frameworkPlugin
const noFramework = filter(negate(getFramework))

const encumberedPlugin = (plugin) => {
  return some(Boolean,[getDepends(plugin).length, getProvides(plugin).length, getOptional(plugin).length])
}

const findUnEncumbered = filter(negate(encumberedPlugin))
const findEncumbered = filter(encumberedPlugin)

const onlyFramework = filter(getFramework)

export function solveOrdering(plugins: any){
  let topo = new Topological()
  let groupedByInjectable = groupByParams(plugins)

  let flattenDeps = generateDeps(groupedByInjectable)
  let framework = filter(getFramework, plugins)

  let encumbered = findEncumbered(noFramework(plugins))
  let unEncumbered = findUnEncumbered(noFramework(plugins))

  // Add Dependency free plugins to the toposorter first


  let top = map((plugin): [string, any] => {
    // console.log(plugin)
    let depends = [...flattenDeps(getDepends(plugin)), ...getOr([],'runtimeConfiguration.additionalDependencies', plugin)]
    let optional = flattenDeps(getOptional(plugin))
    let provides = flattenDeps(getProvides(plugin))
    let deps = {
      depends: depends,
      optional: optional,
      provides: provides,
      frameworkPlugin: getOr(false, 'state.configuration.frameworkPlugin', plugin),
      encumbered: !!some(Boolean, [depends.length,optional.length, provides.length])
    }
    return [getFqShortname(plugin), deps]
  }, plugins)

  // console.log(fromPairs(top))

  let f = filter(([name, plugin]) => {
    //@ts-ignore
    return plugin.frameworkPlugin
  }, top)

  let u = filter(([name, plugin]) => {
    //@ts-ignore
    return !plugin.encumbered && !plugin.frameworkPlugin
  }, top)

  let e = filter(([name, plugin]) => {
    //@ts-ignore
    return plugin.encumbered && !plugin.frameworkPlugin
  }, top)

  console.log(f, 'framework')
  console.log(u, 'unencumberd')
  console.log(e, 'encumbered')

  each(([name, plugin]) => {
    // console.log(name)
    topo.add(name, [])
  },u)

  each(([name, plugin]) => {
    console.log(name, plugin.depends)
    topo.add(name, plugin.depends)
    topo.add(name, plugin.optional)

    each((provide) => {
      if(provide !== name){
        topo.add(provide, name)
      }
    }, plugin.provides)
  },e)
  // each((plugin: any) => {
  //   let name = getFqShortname(plugin)
  //   topo.add(name, [])
  //
  // }, unEncumbered)

  // Followed by plugins that actually need to be sorted.
  // each((plugin: any) => {
  //   // console.log(plugin.runtimeConfiguration)
  //   let name = getFqShortname(plugin)
  //   // console.log(name, plugin.runtimeConfiguration)
  //   let requiredDeps = flattenDeps(getDepends(plugin))
  //   // console.log(requiredDeps, 'req')
  //   let optionalDeps = flattenDeps(getOptional(plugin))
  //   // console.log(optionalDeps, 'opt')
  //   // @ts-ignore
  //
  //   topo.add(name, requiredDeps)
  //   // @ts-ignore
  //   topo.add(name, optionalDeps)
  //
  //   if(isArray(getProvides(plugin))){
  //     each((p) => {
  //       if(p !== name){
  //         topo.add(p, name)
  //       }
  //
  //     }, plugin.state.configuration.provides)
  //   }
  //
  // // }, noFramework(plugins))
  // }, encumbered)

  let handleAdditional = compose(each(([name, deps]) => {
    // console.log(name, deps)
    each((d) => {
      topo.add(d, name)
    }, deps)
  }), filter(([name, deps]) => {
    return deps.length
  }),
    map((plugin) => {
      return [getFqShortname(plugin), get('runtimeConfiguration.additionalDependencies', plugin)]
    }))


  let extract = extractPluginOrder(plugins)
  let frameworkFirst = map(getFqShortname, framework)

  let externalPlugins = extract(topo.sort())

  return [...frameworkFirst, ...externalPlugins]
}
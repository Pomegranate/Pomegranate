/**
 * @file solveOrdering
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import {ValidatedPlugin} from "../Plugin";
import {Topological} from "./Topological";
import {compose, each, filter, flatten, groupBy, map, getOr, get, keyBy, isObject, isArray, negate} from "lodash/fp";
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
const onlyFramework = filter(getFramework)

export function solveOrdering(plugins: any){
  let topo = new Topological()
  let groupedByInjectable = groupByParams(plugins)
  let flattenDeps = generateDeps(groupedByInjectable)


  let notFramework = filter(negate(getFramework), plugins)
  let framework = filter(getFramework, plugins)

  each((plugin: any) => {
    let name = getFqShortname(plugin)
    let requiredDeps = flattenDeps(getDepends(plugin))
    let optionalDeps = flattenDeps(getOptional(plugin))
    // @ts-ignore
    topo.add(name, requiredDeps)
    // @ts-ignore
    topo.add(name, optionalDeps)

    if(isArray(getProvides(plugin))){
      each((p) => {
        if(p !== name){
          topo.add(p, name)
        }

      }, plugin.state.configuration.provides)
    }

  }, noFramework(plugins))


  let extract = extractPluginOrder(plugins)
  let frameworkFirst = map(getFqShortname, framework)
  let externalPlugins = extract(topo.sort())

  return [...frameworkFirst, ...externalPlugins]
}
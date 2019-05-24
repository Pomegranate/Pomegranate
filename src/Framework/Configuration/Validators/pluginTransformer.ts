/**
 * @file pluginBlueprintValidator
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import Bluebird from 'bluebird'
import {
  compact,
  getOr,
  get,
  identity,
  includes,
  every,
  isArray,
  isFunction,
  isNull,
  isPlainObject,
  isString,
  isUndefined,
  matchesProperty,
  has,
  memoize
} from 'lodash/fp'

import {hasKeysWith} from "lodash-fun";
import {validParameter} from "../../Common/stringFuns";
import {normalize} from "path";
import {isPluginDirectory, pluginTypes} from "../../Plugin";
import {RuntimeFrameworkState} from "../index";
import {MagnumDI} from "magnum-di";

const hasHookFuns = hasKeysWith(['load', 'start', 'stop'], isFunction)

const isCommand = matchesProperty('configuration.type', 'command')
const isOverride = matchesProperty('configuration.type', 'override')
const isInstaller = matchesProperty('configuration.type', 'installer')


const isNullOrUndefined = v => (isNull(v) || isUndefined(v))

const defaultArrayFromNull = (mayBeArr: any[], errmsg: string) => {
  return isNull(mayBeArr) ? [] : isArray(mayBeArr) ? compact(mayBeArr) : new Error(errmsg)
}

const getNamespace = (srcConfig) => {
  let ns = getOr(false, 'loadMetadata.namespace', srcConfig)
  return ns ? [ns] : []
}

const mustHaveInjectable = ['anything', 'factory', 'instance', 'merge']
const requiresInjectableParam = (srcPlugin) => {
  return includes(srcPlugin.configuration.type, mustHaveInjectable)
}

const mustHaveInjectableScope = ['global', 'namespace', 'application']
const hasValidInjectableScope = (injectableScope: string) => {
  return includes(injectableScope, mustHaveInjectableScope)
}

const validateInjectableParam = (injectableParam, errMsg) => {
  return validParameter(injectableParam) ? injectableParam : new Error(errMsg)
}

function fqn(srcConfig) {
  return [...getNamespace(srcConfig), ...srcConfig.loadMetadata.parents]
}

const getConfigMeta = memoize((srcPlugin) => {
  let loadSource = getOr('unknown', 'loadSrc', srcPlugin)
  let moduleName = getOr('Name missing', 'moduleSrc', srcPlugin)
  let pluginName = getOr(moduleName, 'configuration.name', srcPlugin)
  let pluginType = getOr('unknown', 'configuration.type', srcPlugin)
  return {loadSource, moduleName, pluginName, pluginType}
})

export const transformer = (FrameworkState: RuntimeFrameworkState, GlobalInjector: MagnumDI) => {

  return {
    fqn: (_, src) => {
      let ns = get('loadMetadata.namespace', src)
      let parents = get('loadMetadata.parents', src)
      let name = get('state.configuration.name', src)
      let fqn = ns ? [ns] : []
      return [...fqn, ...parents, name]
    },
    name: (_, src) => {
      let name = get('state.configuration.name', src)
      return isString(name) ? [...fqn(src), name] : []
    },
    baseDirectory: _ => normalize(FrameworkState.baseDirectory),
    projectDirectory: _ => normalize(FrameworkState.projectDirectory),
    buildDirectory: _ => normalize(FrameworkState.buildDirectory),
  }

}


// fqn: (_, srcPlugin) => {
//   let fqn = srcPlugin.namespace ? [srcPlugin.namespace] : []
//   return [...fqn, ...srcPlugin.parents, srcPlugin.configuration.name]
// },
//   name: (name, srcPlugin) => {
//   let {loadSource, moduleName, pluginName} = getConfigMeta(srcPlugin)
//   let errMsg = `${loadSource} Plugin ${pluginName} is missing configuration.name`
//   return isString(name) ? [...fqn(srcPlugin), name] : new Error(errMsg)
// },
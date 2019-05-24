/**
 * @file SharedValidators
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {
  compact,
  toUpper,
  getOr,
  includes,
  isArray,
  isFunction,
  isNull,
  isString,
  isUndefined,
  isBoolean,
  memoize,
  isPlainObject, every
} from 'lodash/fp'
import {validParameter} from "../Common/stringFuns";

/**
 * TODO - Move pluginTypes to Plugin-tools
 * @author - Jim Bulkowski
 * @date - 2019-04-16
 * @time - 08:19
 */


import {isPluginDirectory, pluginTypes} from "../Plugin";
import {PluginDirectory} from "@pomegranate/plugin-tools";

export const getConfigMeta = memoize((srcPlugin) => {
  let loadSource = getOr('unknown', 'loadSrc', srcPlugin)
  let moduleName = getOr('Name missing', 'moduleSrc', srcPlugin)
  let pluginName = getOr(moduleName, 'configuration.name', srcPlugin)
  let pluginType = getOr('unknown', 'configuration.type', srcPlugin)
  return {loadSource, moduleName, pluginName, pluginType}
})

const defaultArrayFromNull = (mayBeArr: any[], errmsg: string) => {
  return isNull(mayBeArr) ? [] : isArray(mayBeArr) ? compact(mayBeArr) : new Error(errmsg)
}

const isNullOrUndefined = v => (isNull(v) || isUndefined(v))

const validDirectoryProp = every((p: string | PluginDirectory) => {
  return isString(p) || isPluginDirectory(p)
})

const validateInjectableParam = (injectableParam, errMsg) => {
  return validParameter(injectableParam) ? injectableParam : new Error(errMsg)
}

/**
 * TODO - Move injectableScopes to Plugin-tools
 * @author - Jim Bulkowski
 * @date - 2019-04-16
 * @time - 08:19
 */


const mustHaveInjectableScope = ['global', 'namespace', 'application']
const hasValidInjectableScope = (injectableScope: string) => {
  return includes(injectableScope, mustHaveInjectableScope)
}

export const variables = async (variables, srcPlugin) => {

  // Optional Plugin Parameter.
  if (isNullOrUndefined(variables)) {
    return {}
  }
  let valid = isPlainObject(variables)
  let {loadSource, moduleName, pluginName} = getConfigMeta(srcPlugin)
  let errMsg = `${loadSource} Plugin ${pluginName} variables should be a plain object.`
  return valid ? variables : new Error(errMsg)
}

export const directories = (directories, srcPlugin) => {
  return isNullOrUndefined(directories) ? [] : validDirectoryProp(directories) ? directories : new Error('Plugin directories prop must contain strings or objects of type "PluginDirectory"')
}

export const configName = (name, srcPlugin) => {
  return isString(name) ? name : (_ => {
    let {loadSource, moduleName, pluginName} = getConfigMeta(srcPlugin);
    new Error(`${loadSource} Plugin ${pluginName} is missing configuration.name`)
  })()
}

export const configType = (type, srcPlugin) => {
  let {loadSource, moduleName, pluginName} = getConfigMeta(srcPlugin)
  let errMsg = `${loadSource} Plugin ${pluginName} is missing configuration.type`
  return (includes(type, pluginTypes)) ? type : (_ => {
    let {loadSource, moduleName, pluginName} = getConfigMeta(srcPlugin);
    new Error(`${loadSource} Plugin ${pluginName} is missing configuration.type`)
  })()
}

export const configInjectableParam = (injectableParam, srcPlugin) => {
  let {loadSource, moduleName, pluginName, pluginType} = getConfigMeta(srcPlugin)
  let errMsg = `${loadSource} Plugin ${pluginName} config.injectableParam ${injectableParam} is not a valid ES5 parameter.`
  if (isNullOrUndefined(injectableParam)) {
    return new Error(`${loadSource} Plugin "${pluginName}" of type "${pluginType}" requires "config.injectableParam" to be set.`)
  }
  return validateInjectableParam(injectableParam, errMsg)


}

export const configInjectableScope = (injectableScope) => {

  let scope = !injectableScope ?
    'global' :
    hasValidInjectableScope(injectableScope) ?
      injectableScope :
      new Error('config.injectableScope must be either "global", "namespace", or "application"')

  return scope
}

export const configFrameworkPlugin = (frameworkPlugin) => {
  return isNullOrUndefined(frameworkPlugin) ? false :
    isBoolean(frameworkPlugin) ? frameworkPlugin : new Error('configuration.frameworkPlugin must be a boolean.')
}

export const configInjectorDeps = (prop: 'depends' | 'provides' | 'optional') => depends => defaultArrayFromNull(depends, `configuration.${prop} must be string[]`)


export const hooksRequired = (prop: 'load') => (loadHook) => isFunction(loadHook) ? loadHook : new Error(`${toUpper(prop)} Hook must be a function.`)

export const hooksOptional = (prop: 'start' | 'stop') => (optionalHook, srcPlugin) => isFunction(optionalHook) ? optionalHook : isNullOrUndefined(optionalHook) ? () => {
} : new Error(`${toUpper(prop)} Hook if defined, must be a function.`)

export const commands = (commands) => {
  return isFunction(commands) ? commands : null
}
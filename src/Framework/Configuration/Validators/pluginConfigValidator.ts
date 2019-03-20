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

const isOverride = matchesProperty('configuration.type', 'override')
const isInstaller = matchesProperty('configuration.type', 'installer')


const isNullOrUndefined = v => (isNull(v) || isUndefined(v))


const defaultArrayFromNull = (mayBeArr: any[], errmsg: string) => {
  return isNull(mayBeArr) ? [] : isArray(mayBeArr) ? compact(mayBeArr) : new Error(errmsg)
}

const getNamespace = (srcConfig) => {
  let ns = getOr(false, 'namespace', srcConfig)
  return ns ? [ns] : []
}

const mustHaveInjectable = ['anything', 'factory', 'instance', 'merge']
const requiresInjectableParam = (srcPlugin) => {
  return includes(srcPlugin.configuration.type,mustHaveInjectable)
}

const validateInjectableParam = (injectableParam, errMsg) => {
  return validParameter(injectableParam) ? injectableParam : new Error(errMsg)
}

function fqn(srcConfig) {
  return [...getNamespace(srcConfig), ...srcConfig.parents]
}

const getConfigMeta = memoize((srcPlugin) => {
  let loadSource = getOr('unknown', 'loadSrc', srcPlugin)
  let moduleName = getOr('Name missing', 'moduleSrc', srcPlugin)
  let pluginName = getOr(moduleName, 'configuration.name', srcPlugin)
  let pluginType = getOr('unknown', 'configuration.type', srcPlugin)
  return {loadSource, moduleName, pluginName, pluginType}
})

export const pluginConfigValidators = (FrameworkState: RuntimeFrameworkState, PluginInjector: MagnumDI) => {
  return {
    variables: async (variables, srcPlugin) => {

      // Optional Plugin Parameter.
      if (isNullOrUndefined(variables)) {
        return {}
      }
      let valid = isPlainObject(variables)
      let {loadSource, moduleName, pluginName} = getConfigMeta(srcPlugin)
      let errMsg = `${loadSource} Plugin ${pluginName} variables should be a plain object.`
      return valid ? variables : new Error(errMsg)
    },
    overrides: (overrides, srcPlugin) => {
      let {loadSource, moduleName, pluginName} = getConfigMeta(srcPlugin)
      let errMsg = `${loadSource} Plugin ${pluginName} contains an 'overrides' property but is not an override type plugin.`

      return isOverride(srcPlugin) ? overrides : has('overrides', srcPlugin) ? new Error(errMsg) : null
    },
    installs: (installs, srcPlugin) => {
      return installs
    },
    directories: (directories, srcPlugin) => {

      if (isNullOrUndefined(directories)) {
        return []
      }
      let allStringPaths = every((p) => {
        return isString(p) || isPluginDirectory(p)
      }, directories)

      return allStringPaths ? directories : new Error('Plugin directories prop must contain strings or objects of type "PluginDirectory"')

      return directories
    },
    configuration: {
      fqn: (_, srcPlugin) => {
        let fqn = srcPlugin.namespace ? [srcPlugin.namespace] : []
        return [...fqn, ...srcPlugin.parents, srcPlugin.configuration.name]
      },
      name: (name, srcPlugin) => {
        let {loadSource, moduleName, pluginName} = getConfigMeta(srcPlugin)
        let errMsg = `${loadSource} Plugin ${pluginName} is missing configuration.name`
        return isString(name) ? [...fqn(srcPlugin), name] : new Error(errMsg)
      },
      type: (type, srcPlugin) => {
        let {loadSource, moduleName, pluginName} = getConfigMeta(srcPlugin)
        let errMsg = `${loadSource} Plugin ${pluginName} is missing configuration.type`
        if(type === 'application'){
          return srcPlugin.applicationPlugins ? type : new Error('Application type plugins must include plugin.applicationPlugins array.')
        }
        return (includes(type, pluginTypes)) ? type : new Error(errMsg)
      },
      injectableParam: (injectableParam, srcPlugin) => {
        let {loadSource, moduleName, pluginName, pluginType} = getConfigMeta(srcPlugin)
        let errMsg = `${loadSource} Plugin ${pluginName} config.injectableParam ${injectableParam} is not a valid ES5 parameter.`
        if(requiresInjectableParam(srcPlugin)){
          if(isNullOrUndefined(injectableParam)){
            return new Error(`${loadSource} Plugin "${pluginName}" of type "${pluginType}" requires "config.injectableParam" to be set.`)
          }
          return validateInjectableParam(injectableParam, errMsg)
        }

        return injectableParam
      },
      frameworkPlugin: (frameworkPlugin) => {
        return frameworkPlugin
      },
      depends: (depends) => defaultArrayFromNull(depends, 'configuration.depends must be string[]'),
      provides: (provides) => defaultArrayFromNull(provides, 'configuration.provides must be string[]'),
      optional: (optional) => defaultArrayFromNull(optional, 'configuration.optional must be string[]'),
    },
    hooks: {
      load: (hook) => {
        return isFunction(hook) ? hook : new Error('Load Hook must be a function.')
      },
      start: (hook,srcPlugin) => {
        return isFunction(hook) ? hook : isOverride(srcPlugin) ? null : () => {}
      },
      stop: (hook, srcPlugin) => {
        return isFunction(hook) ? hook : isOverride(srcPlugin) ? null : () => {}
      }
    },
    commands: (commands) => {
      return isFunction(commands) ? commands : null
    },
    namespace: identity,
    loadSrc: identity,
    moduleSrc: identity,
    parents: identity,
    baseDirectory: _ => normalize(FrameworkState.baseDirectory),
    projectDirectory: _ => normalize(FrameworkState.projectDirectory),
    buildDirectory: _ => normalize(FrameworkState.buildDirectory),
    // missingDependencies: missingDependencies => []
  }
}
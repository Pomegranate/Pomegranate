/**
 * @file merge
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import {compact, every, isArray, isFunction, isNull, isPlainObject, isString, isUndefined} from 'lodash/fp'
import {isPluginDirectory, PluginDirectory} from '@pomegranate/plugin-tools'
const isNullOrUndefined = v => (isNull(v) || isUndefined(v))
const defaultArrayFromNull = (mayBeArr: any[], errmsg: string) => {
  return isNull(mayBeArr) ? [] : isArray(mayBeArr) ? compact(mayBeArr) : new Error(errmsg)
}

let validDirectoryProp = every((p: string | PluginDirectory) => {
  return isString(p) || isPluginDirectory(p)
})

export const InjectableValidator = {
  variables: (variables, srcPlugin) => {
    return isPlainObject(variables) ? variables : new Error('variables should be a plain object.')
  },
  directories: (directories, srcPlugin) => {
    return isNullOrUndefined(directories) ? [] : validDirectoryProp(directories) ? directories : new Error('Plugin directories prop must contain strings or objects of type "PluginDirectory"')
  },
  configuration: {
    name: ()=>{

    },
    type: () => {

    },
    injectableParam: () => {

    },
    injectableScope: () => {

    },
    frameworkPlugin: () => {

    },
    depends: (depends) => defaultArrayFromNull(depends, 'configuration.depends must be string[]'),
    provides: (provides) => defaultArrayFromNull(provides, 'configuration.provides must be string[]'),
    optional: (optional) => defaultArrayFromNull(optional, 'configuration.optional must be string[]'),
  },
  hooks: {
    load: (hook, srcPlugin) => {
      return isFunction(hook) ? hook : new Error(`Load Hook must be a function.`)
    },
    start: (hook,srcPlugin) => {
      return isFunction(hook) ? hook : isNullOrUndefined(hook) ? () => {} : new Error(`Start Hook if defined, must be a function.`)
    },
    stop: (hook, srcPlugin) => {
      return isFunction(hook) ? hook : isNullOrUndefined(srcPlugin) ? () => {} : new Error(`Stop Hook if defined, must be a function.`)
    }
  },
  commands: (commands) => {
    return isFunction(commands) ? commands : null
  },
}
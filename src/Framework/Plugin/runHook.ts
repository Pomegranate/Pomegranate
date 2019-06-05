/**
 * @file runHook
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import {get, getOr, map, each, flattenDeep, has, clone, set} from 'lodash/fp'
import {MagnumDI} from "magnum-di";
import {ComposedPlugin} from ".";
import {Defer} from "../Common/Defer";
import Bluebird from 'bluebird'
import {ValidatedConfiguration} from "../Configuration";
import {PomegranateLogger} from "../FrameworkLogger";
import {LogManager} from "../FrameworkLogger/LogManager";
import {switchWith} from "lodash-fun";


const buildInjectorChain = (plugin: any) => {
  let ns = get('plugin.namespace', plugin)
  let parents = get('plugin.parents', plugin)
  return  ns ? [ns, ...parents] : parents

}

const selectInjector = (GlobalInjector: MagnumDI, plugin): MagnumDI => {
  let scope = get('plugin.configuration.injectableScope', plugin)

  if(scope === 'global'){
    return GlobalInjector
  }

  if(scope === 'namespace'){
    let ns = get('plugin.namespace', plugin)
    return ns ? GlobalInjector.findChain([ns]) : GlobalInjector
  }

  if(scope === 'application'){
    let chain = buildInjectorChain(plugin)
    let application = get('plugin.application', plugin)
    return GlobalInjector.findChain(chain)
  }

  throw new Error(`Unable to compute and injection scope for this plugin, "config.injectableScope" must be global, namespace, or application
  If You are seeing this error something serious has gone wrong.`)
}

let computeCase = get('type')

const typeFuns = {
  action: (v) => {
    return []
  },
  anything: (v) => {
    return [injectable(v, 'anything')]
  },
  composite: (v) => {
    return composite(v)
  },
  factory: (v) => {
    return [injectable(v, 'factory')]
  },
  instance: (v) => {
    return [injectable(v, 'instance')]
  },
  merge: (v) => {
    return [injectable(v, 'merge')]
  },
  loghandler: (v) => {
    return [loghandler(v)]
  }
}

const handleInjectable = switchWith(computeCase, typeFuns)

function newStructure(pluginData) {
  return handleInjectable(pluginData)
}

function structure(composedPlugin: any, result) {
  let type = get('state.configuration.type', composedPlugin)

  return handleInjectable({type, composedPlugin, result})
}

function composite(plugin, LogManager?) {
  let injectables = get('hookResult', plugin)
  return flattenDeep(map((result) => {
    let type = getOr('anything', 'type', result)
    let clonePlugin = clone(plugin.plugin)
    let n = set('configuration.type',type, clonePlugin)
    let o = set('configuration.injectableParam',get('injectableParam', result),n)
    let p = set('configuration.injectableScope',getOr('global','injectableScope', result),o)

    let newHandler = {
      type,
      plugin: p,
      hookResult: get('load', result)
    }
    return handleInjectable(newHandler)
  }, injectables))
}

function injectable(plugin, type) {
  return (globalInjector, LogManager) => {
    let injectableParam = get('plugin.configuration.injectableParam', plugin)
    let injectableValue = get('hookResult', plugin)

    let scopedInjector = selectInjector(globalInjector, plugin)
    scopedInjector[type](injectableParam, injectableValue)
    return {type, injectableParam}
  }
}

function loghandler(plugin) {
  return (globalInjector, LogManager) => {
    let injectableValue = get('hookResult', plugin)
    LogManager.addHandler(injectableValue)
    return null
  }
}


export function placeInjectables(composedPlugin, hookResult, pluginLogger, GlobalInjector: MagnumDI, LogManager) {
  let type = get('state.configuration.type', composedPlugin)
  let data = {
    type,
    plugin: {
      configuration: get('state.configuration', composedPlugin),
      parents: get('loadMetadata.parents', composedPlugin),
      namespace: get('loadMetadata.namespace', composedPlugin),
      application: get('loadMetadata.application', composedPlugin),
    },
    hookResult
  }

  let toInject = handleInjectable(data)
  each((i) => {
    let output = i(GlobalInjector, LogManager)
    if (output) {
      composedPlugin.logger.log(`Added ${output.injectableParam} - ${output.type} to injector.`)
    }
  }, toInject)

  return null

}

function composeLoadRunner(frameworkConf: ValidatedConfiguration, LogManager: LogManager, GlobalInjector: MagnumDI) {
  return async function loadRunner(composedPlugin: ComposedPlugin) {
    let computedName = get('computedMetadata.name', composedPlugin)
    let pluginName = get('configuration.name', composedPlugin)
    frameworkConf.FrameworkMetrics.startPluginPhase(pluginName, 'load')

    let ChildInjector = composedPlugin.injector
    let PluginTimer = ChildInjector.get('PluginTimer')
    let PluginLogger = ChildInjector.get('PluginLogger')
    //@ts-ignore
    let hookFn = composedPlugin.state.hooks['load']

    PluginLogger.log('Loading')
    let racer = PluginTimer.start()

    let result = Bluebird.try(() => {
      return ChildInjector.inject(hookFn)
    })

    return Bluebird.race([result, racer])
      .then((result) => {
        PluginTimer.reset()
        return placeInjectables(composedPlugin, result, PluginLogger, GlobalInjector, LogManager)
        // return structureInjectables(result, composedPlugin, PluginLogger, GlobalInjector, LogManager)
      })
      .then((result) => {
        let elapsed = frameworkConf.FrameworkMetrics.stopPluginPhase(pluginName, 'load')
        PluginLogger.log(`Loaded in ${elapsed}ms`, 3)
        return computedName
      })
  }
}

function composeStartRunner(frameworkConf: ValidatedConfiguration, LogManager: LogManager, GlobalInjector: MagnumDI) {
  return async function startRunner(composedPlugin: ComposedPlugin) {
    let computedName = get('computedMetadata.name', composedPlugin)
    let pluginName = get('state.configuration.name', composedPlugin)
    frameworkConf.FrameworkMetrics.startPluginPhase(pluginName, 'start')

    let ChildInjector = composedPlugin.injector
    let PluginTimer = ChildInjector.get('PluginTimer')
    let PluginLogger = ChildInjector.get('PluginLogger')
    //@ts-ignore
    let hookFn = composedPlugin.state.hooks['start']

    PluginLogger.log('Starting')
    let racer = PluginTimer.start()

    let result = Bluebird.try(() => {
      return ChildInjector.inject(hookFn)
    })

    return Bluebird.race([result, racer])
      .then((result) => {
        PluginTimer.reset()
        let elapsed = frameworkConf.FrameworkMetrics.stopPluginPhase(pluginName, 'start')
        PluginLogger.log(`Started in ${elapsed}ms`, 3)
        return computedName
      })
  }
}

function composeStopRunner(frameworkConf: ValidatedConfiguration, LogManager: LogManager, GlobalInjector: MagnumDI) {
  return async function stopRunner(composedPlugin: ComposedPlugin) {
    let computedName = get('computedMetadata.name', composedPlugin)
    let pluginName = get('state.configuration.name', composedPlugin)
    frameworkConf.FrameworkMetrics.startPluginPhase(pluginName, 'stop')

    let ChildInjector = composedPlugin.injector
    let PluginTimer = ChildInjector.get('PluginTimer')
    let PluginLogger = ChildInjector.get('PluginLogger')
    //@ts-ignore
    let hookFn = composedPlugin.state.hooks['stop']
    PluginLogger.log('Stopping')
    let racer = PluginTimer.start()

    let result = Bluebird.try(() => {
      return ChildInjector.inject(hookFn)
    })

    return Bluebird.race([result, racer])
      .then((result) => {
        PluginTimer.reset()
        let elapsed = frameworkConf.FrameworkMetrics.stopPluginPhase(pluginName, 'stop')
        PluginLogger.log(`Stopped in ${elapsed}ms`, 3)
        return computedName
      })
      .catch((err) => {
        PluginLogger.error(err.message)
        throw err
      })
  }
}

export function composeHookRunners(frameworkConf: ValidatedConfiguration, LogManager: LogManager, GlobalInjector: MagnumDI) {

  return {
    runLoadHook: composeLoadRunner(frameworkConf, LogManager, GlobalInjector),
    runStartHook: composeStartRunner(frameworkConf, LogManager, GlobalInjector),
    runStopHook: composeStopRunner(frameworkConf, LogManager, GlobalInjector)
  }

}
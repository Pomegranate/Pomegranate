/**
 * @file runHook
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import {get, map, each, flattenDeep, isFunction} from 'lodash/fp'
import {MagnumDI} from "magnum-di";
import {ComposedPlugin} from ".";
import {Defer} from "../Common/Defer";
import Bluebird from 'bluebird'
import {ValidatedConfiguration} from "../Configuration";
import {PomegranateLogger} from "../FrameworkLogger";
import {LogManager} from "../FrameworkLogger/LogManager";
import {switchWith} from "lodash-fun";

let computeCase = get('type')

function composite(plugin, LogManager?) {
  let injectables = get('result', plugin)
  return flattenDeep(map((result) => {
    let type = result.type ? result.type : 'anything'
    return structure(type, result.injectableParam, result.value)
  }, injectables))
}

function injectable(plugin, type){
  return (parentInjector, LogManager) => {
    let injectableParam = get('injectableParam', plugin) //?
    let injectableValue = get('result', plugin)
    parentInjector[type](injectableParam, injectableValue)
    return injectableParam
  }
}

function loghandler(plugin){
  return (parentInjector, LogManager) => {
    let injectableValue = get('result', plugin)
    LogManager.addHandler(injectableValue)
    return null
  }
}

const typeFuns = {
  action: (v) => {
    return []
  },
  anything: (v) => {
    return [injectable(v, 'service')]
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

function structure(type: any, injectableParam: any, result) {
  return handleInjectable({type, injectableParam, result})
}

// export function switchInjectables(type: string, injectableParam: string, value: any) {
//   switch (type) {
//     case 'action':
//       return []
//     case 'anything':
//       return [{type: 'service', injectableParam, value}]
//     case 'composite':
//       return flattenDeep(map((iResult) => {
//
//         let type = iResult.type ? iResult.type : 'anything'
//         return switchInjectables(type, iResult.injectableParam, iResult.value)
//       }, value))
//     case 'factory':
//       return [{type: 'factory', injectableParam, value}]
//     case 'instance':
//       return [{type: 'instance', injectableParam, value}]
//     case 'merge':
//       return [{type: 'merge', injectableParam, value}]
//     case 'loghandler':
//       return [(LogManager) => {
//         LogManager.addHandler(value)
//       }]
//     default:
//       throw new Error('Unable to handle this plugins dependency.')
//
//   }
// }

export function structureInjectables(result: any, composedPlugin: ComposedPlugin, pluginLogger: PomegranateLogger, pluginInjector: MagnumDI, LogManager) {
  let type = get('configuration.type', composedPlugin)
  let injectableParam = get('configuration.injectableParam', composedPlugin)
  let parentInjector = pluginInjector.getParent(true)

  let toInject = structure(type, injectableParam, result)
  each((i) => {
    let addedParam = i(parentInjector, LogManager)

    if(addedParam){
      composedPlugin.logger.log(`Added ${type} as ${addedParam} to injector.`)
    }
  },toInject)

  // console.log(composedPlugin)
  // let injectables = switchInjectables(type, injectableParam, result)
  // console.log(injectables)
  // each((injectable) => {
  //   if(isFunction(injectable) ){
  //     injectable(LogManager)
  //     return
  //   }
  //   pluginLogger.log(`Adding ${injectable.type} as ${injectable.injectableParam} to injector.`)
  //   parentInjector[injectable.type](injectable.injectableParam, injectable.value)
  // }, injectables)
  return null
}

function composeLoadRunner(frameworkConf: ValidatedConfiguration, LogManager: LogManager, PluginInjector: MagnumDI) {
  return async function loadRunner(composedPlugin: ComposedPlugin) {
    let pluginName = get('configuration.name', composedPlugin)
    frameworkConf.FrameworkMetrics.startPluginPhase(pluginName, 'load')

    let ChildInjector = composedPlugin.injector
    let PluginTimer = ChildInjector.get('PluginTimer')
    let PluginLogger = ChildInjector.get('PluginLogger')
    let hookFn = composedPlugin.hooks['load']

    PluginLogger.log('Loading')
    let racer = PluginTimer.start()

    let result = Bluebird.try(() => {
      return ChildInjector.inject(hookFn)
    })

    return Bluebird.race([result, racer])
      .then((result) => {
        PluginTimer.reset()
        return structureInjectables(result, composedPlugin, PluginLogger, ChildInjector, LogManager)
      })
      .then((result) => {
        let elapsed = frameworkConf.FrameworkMetrics.stopPluginPhase(pluginName, 'load')
        PluginLogger.log(`Loaded in ${elapsed}ms`, 3)
        return pluginName
      })
  }
}

function composeStartRunner(frameworkConf: ValidatedConfiguration, LogManager: LogManager, PluginInjector: MagnumDI) {
  return async function startRunner(composedPlugin: ComposedPlugin) {
    let pluginName = get('configuration.name', composedPlugin)
    frameworkConf.FrameworkMetrics.startPluginPhase(pluginName, 'start')

    let ChildInjector = composedPlugin.injector
    let PluginTimer = ChildInjector.get('PluginTimer')
    let PluginLogger = ChildInjector.get('PluginLogger')
    let hookFn = composedPlugin.hooks['start']

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
        return pluginName
      })
  }
}

function composeStopRunner(frameworkConf: ValidatedConfiguration, LogManager: LogManager, PluginInjector: MagnumDI) {
  return async function stopRunner(composedPlugin: ComposedPlugin) {
    let pluginName = get('configuration.name', composedPlugin)
    frameworkConf.FrameworkMetrics.startPluginPhase(pluginName, 'stop')

    let ChildInjector = composedPlugin.injector
    let PluginTimer = ChildInjector.get('PluginTimer')
    let PluginLogger = ChildInjector.get('PluginLogger')
    let hookFn = composedPlugin.hooks['stop']
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
        return pluginName
      })
      .catch((err) => {
        console.log(err)
        throw err
      })
  }
}

export function composeHookRunners(frameworkConf: ValidatedConfiguration, LogManager: LogManager, PluginInjector: MagnumDI) {

  return {
    runLoadHook: composeLoadRunner(frameworkConf, LogManager, PluginInjector),
    runStartHook: composeStartRunner(frameworkConf, LogManager, PluginInjector),
    runStopHook: composeStopRunner(frameworkConf, LogManager, PluginInjector)
  }

}
/**
 * @file createPlugins
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import {FutureState} from "./Common/FutureState";
import {composeP} from 'lodash-fun'
import {ComposedPlugin, ValidatedPlugin} from "./Plugin";
import {assign, difference, get, getOr, isFunction, isObject} from 'lodash/fp'
import {missingKeysDeep} from "lodash-fun";
import Bluebird from 'bluebird'
import {provideDependencies} from "./Dependency";
import {ComposedFrameworkState} from "./Configuration";
import {MagnumDI} from "magnum-di";
import {requireFile} from "./Configuration/helpers";
import {configObjectPath, getConfigFilePath, getFqShortname} from "./Plugin/helpers";
import {ComposeDirectories} from "./Plugin/ComposeDirectories";
import {rightBar} from "./Common/frameworkOutputs";
import {LogManager} from "./FrameworkLogger/LogManager";
import {ValidatedTransformer} from "./Validation";


export const composePlugins = (FrameworkConfiguration: ValidatedTransformer, LogManager: LogManager, frameworkMetrics, loggerFactory, PluginDI: MagnumDI) => {

  const composePlugin = composeP(async (plugin)=>{

  })

  return function (skeletons: ValidatedPlugin[]) {
    rightBar(LogManager.use('system')).run({msg: 'Initializing Plugins.'})
    frameworkMetrics.startFrameworkPhase('InitializePlugins')
    return Bluebird.map(skeletons, (skeleton: ValidatedPlugin) => {
      let PluginName = getFqShortname(skeleton)
      let pullProp = configObjectPath(skeleton)


      frameworkMetrics.startPluginPhase(PluginName, 'initialize')

      return FutureState<any>(skeleton)
        .map(async (skeleton, collector) => { // Extract Plugin variables and runtime config.
          let fileVars = await requireFile(FrameworkConfiguration.getKey('buildDirs.pluginConfigDirectory'), `${getConfigFilePath(skeleton)}.js`)
          let inject = isFunction(fileVars) ? PluginDI.inject(fileVars) : fileVars
          let vars = getOr(skeleton.state.variables, pullProp('variables'), inject)
          let conf = getOr({disabled: false, additionalDependencies: []}, pullProp('config'), inject)
          let missingKeys = missingKeysDeep(skeleton.state.variables, vars)
          if (missingKeys.length) {
            throw new Error(`Plugin "${skeleton.state.configuration.name}" config file does not conform with plugin defaults. \n Missing ${missingKeys.join(',')} keys.`)
          }
          collector.runtimeConfiguration = conf
          collector.runtimeVariables = vars
          return collector
        })
        .map(ComposeDirectories(FrameworkConfiguration))
        .map((skeleton, collector) => { // Create our custom Pom logger instance, to use downstream from here.
          let logLevel= get('runtimeConfiguration.logLevel', collector)
          let configFormatting = get('runtimeConfiguration.logFormat', collector)
          let formatting = isObject(configFormatting) ? configFormatting : {log: ['green']}

          collector.logger = LogManager.createLogger({source: PluginName, logLevel: logLevel, logFormat: formatting})//loggerFactory.run(loggerConf)
          collector.logger.log('Initializing.')
          return collector
        })
        .map((skeleton, collector) => {
          collector.timeout = FrameworkConfiguration.getKey('timeout')
          //@ts-ignore
          let missingDeps = difference(skeleton.state.configuration.depends, FrameworkConfiguration.getKey('runtime.allAvailable'))
          let missingAdditional = difference(collector.runtimeConfiguration.additionalDependencies, FrameworkConfiguration.getKey('runtime.allAvailable'))

          if (missingAdditional.length) {
            //@ts-ignore
            collector.logger.error(`Missing requested additionalDependencies from runtime config: ${missingAdditional.join(', ')}`, 0)
            throw new Error('Missing additionalDependencies')
          }
          if (missingDeps.length) {
            //@ts-ignore
            collector.logger.error(`Missing required dependencies: ${missingDeps.join(', ')}`, 0)
            throw new Error('Missing dependencies')
          }
          collector.missingDependencies = missingDeps
          return collector
        })
        .map((skeleton, collector) => {
          let c = assign(collector, skeleton)
          return c
        })
        .map((skeleton, collector) => {
          collector.state.configuration.depends =
            provideDependencies(get('state.configuration.name', collector), getOr([], 'state.configuration.depends', collector), FrameworkConfiguration.getKey('runtime.providingPlugins'))
          return collector
        })
        .run({})
        .then((result) => {
          result.logger.log(`Initialized in ${frameworkMetrics.stopPluginPhase(PluginName, 'initialize')}ms`, 3)
          return result
        })
    })
      .then((results) => {
        LogManager.use('pomegranate').log(`Plugin initialization took ${frameworkMetrics.stopFrameworkPhase('InitializePlugins')}ms.`, 3)
        return results
      })
      .catch((error) => {
        LogManager.use('pomegranate').error('Plugin errored during composition.')
        LogManager.use('pomegranate').error(error)
        throw error
      })
  }
}

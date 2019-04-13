/**
 * @file createPlugins
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import {FutureState} from "./Common/FutureState";
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


export const composePlugins = (pomConf: ComposedFrameworkState, LogManager: LogManager, frameworkMetrics, loggerFactory, PluginDI: MagnumDI) => {
  return function (skeletons: ValidatedPlugin[]) {
    rightBar(LogManager.use('system')).run({msg: 'Initializing Plugins.'})
    frameworkMetrics.startFrameworkPhase('InitializePlugins')
    return Bluebird.map(skeletons, (skeleton: ValidatedPlugin) => {
      // console.log(skeleton)
      let PluginName = getFqShortname(skeleton)
      let pullProp = configObjectPath(skeleton)


      pomConf.FrameworkMetrics.startPluginPhase(PluginName, 'initialize')
      return FutureState<ComposedPlugin>(skeleton)
        .map(async (skeleton, collector) => { // Extract Plugin variables and runtime config.

          let fileVars = await requireFile(pomConf.pluginConfigDirectory, `${getConfigFilePath(skeleton)}.js`)
          let inject = isFunction(fileVars) ? PluginDI.inject(fileVars) : fileVars
          let vars = getOr(skeleton.variables, pullProp('variables'), inject)
          let conf = getOr({disabled: false}, pullProp('config'), inject)
          let missingKeys = missingKeysDeep(skeleton.variables, vars)
          if (missingKeys.length) {
            throw new Error(`Plugin "${skeleton.configuration.name}" config file does not conform with plugin defaults. \n Missing ${missingKeys.join(',')} keys.`)
          }
          collector.runtimeConfiguration = conf
          collector.runtimeVariables = vars
          return collector
        })
        .map(ComposeDirectories(pomConf))
        .map((skeleton, collector) => { // Create our custom Pom logger instance, to use downstream from here.

          let logLevel= get('runtimeConfiguration.logLevel', collector)
          let configFormatting = get('runtimeConfiguration.logFormat', collector)
          let formatting = isObject(configFormatting) ? configFormatting : {log: ['green']}

          collector.logger = LogManager.createLogger({source: PluginName, logLevel: logLevel, logFormat: formatting})//loggerFactory.run(loggerConf)
          collector.logger.log('Initializing.')
          return collector
        })
        .map((skeleton, collector) => {
          collector.timeout = pomConf.timeout
          let missingDeps = difference(skeleton.configuration.depends, pomConf.allAvailable)
          if (missingDeps.length) {
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
          collector.configuration.depends =
            provideDependencies(get('configuration.name', collector), getOr([], 'configuration.depends', collector), pomConf.providingPlugins)
          return collector
        })
        .run({})
        .then((result) => {
          result.logger.log(`Initialized in ${pomConf.FrameworkMetrics.stopPluginPhase(PluginName, 'initialize')}ms`, 3)
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

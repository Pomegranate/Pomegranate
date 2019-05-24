/**
 * @file Pomegranate
 * @description Pomegranate is a unified application
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import {filter, map, find, merge, negate, isNull, toPairs, fromPairs, pickBy, matchesProperty, reduce, has} from 'lodash/fp'
import {EventEmitter} from 'events'

import {DLinkedList} from "immutable-dll";
import {Versions} from "./Versions";
import {PomegranateConfiguration, updateFrameworkMeta} from "./Configuration";
import {MagnumDI} from "magnum-di";
import {composePlugins} from "./composePlugins";
import {ComposedPlugin} from "./Plugin";
import {FrameworkMetrics} from "./FrameworkMetrics";
import {composeHookRunners} from "./Plugin/runHook";
import {rightBar} from "./Common/frameworkOutputs";
import {getFqShortname, joinFqShortname} from "./Plugin/helpers";
import {RuntimeFrameworkState} from "./Configuration";
import {pluralizer} from "./Common/stringFuns";

import * as Handlebars from 'handlebars'

const pluginPluralizer = pluralizer({negative: 'plugins',zero: 'plugins', many: 'plugins', one: 'plugin'})

const isCommand = matchesProperty('state.configuration.type', 'command')

import {
  Configure,
  CreateFrameworkState,
  LoadPlugins,
  ValidatePlugins,
  EnsureResources,
  OverridePlugins,
  PopulateInjectors,
  PopulateCliInjectors,
  OrderPlugins,
} from './Bootstrap'
import {IFutureState} from "./Common/FutureState";
import {CreationMetadata} from "@pomegranate/plugin-tools/PluginTools/builders/Builder";

export interface PomegranateRuntime {
  events: EventEmitter
  externalLog: (method, msg) => any
  load: () => any
  start: () => any
  stop: () => any
}


async function installPlugins(plugins: ComposedPlugin[]) {
  let installers = map((plugin) => {
    return plugin.installs
  }, plugins)
}




export async function RunCLI(baseDirectory: string, config: PomegranateConfiguration){
  let FrameworkEvents = new EventEmitter()
  let RuntimeState = <any>{}
  let GlobalInjector = new MagnumDI()

  GlobalInjector.anything('Env', process.env)
  GlobalInjector.anything('Handlebars', Handlebars)
  let frameworkMetrics = FrameworkMetrics()
  /*
   * Loads and validates the application config, creates the pomegranate framework logger.
   */
  const {PomConfig,FrameworkConfiguration, loggerFactory, frameworkLogger, systemLogger, LogManager} = await Configure(frameworkMetrics, baseDirectory, config)
  const FutureFrameworkState: IFutureState<RuntimeFrameworkState> = await CreateFrameworkState(frameworkLogger, FrameworkConfiguration)
  const FrameworkState = await FutureFrameworkState.getState()

  /*
   * Loads plugins from all sources: Framework, Local and Namespaced.
   */
  let loadedPlugins = await LoadPlugins(FrameworkState, LogManager)

  /*
   * Validates plugin types, values and usage constraints.
   */
  let validatedPlugins = await ValidatePlugins(FrameworkState, LogManager, GlobalInjector, loadedPlugins)

  /*
   * Extract global configuration data from all plugins, including the master required plugin array.
   */
  let FullConfig = await updateFrameworkMeta(LogManager, frameworkMetrics, FutureFrameworkState, validatedPlugins)

  GlobalInjector.anything('PomConfig', FullConfig)
  /*
   * Updates plugins with global state. Attaches all needed properties for downstream use.
   */
  let compPlugins = composePlugins(FullConfig, LogManager, frameworkMetrics, loggerFactory, GlobalInjector)
  let composed = await compPlugins(validatedPlugins)

  let finalPlugins = PopulateCliInjectors(GlobalInjector, composed)

  return {Plugins: finalPlugins, Config: FullConfig}
}


export async function Pomegranate(baseDirectory: string, config: PomegranateConfiguration): Promise<PomegranateRuntime> {
  let FrameworkEvents = new EventEmitter()
  let RuntimeState = <any>{
    loadedPlugins: [],
    startedPlugins: [],
    stoppedPlugins: [],
    isFailed: false,
    failureError: null
  }
  let GlobalInjector = new MagnumDI()
  GlobalInjector.anything('Env', process.env)
  let frameworkMetrics = FrameworkMetrics()

  /*
   * Loads and validates the application config, creates the pomegranate framework logger.
   */
  const {PomConfig, FrameworkConfiguration, loggerFactory, frameworkLogger, LogManager} = await Configure(frameworkMetrics, baseDirectory, config)

  const FutureFrameworkState: IFutureState<RuntimeFrameworkState> = await CreateFrameworkState(frameworkLogger, FrameworkConfiguration)
  const FrameworkState = await FutureFrameworkState.getState()
  // Log in use versions.
  Versions(LogManager.use('pomegranate'))

  /*
   * Loads plugins from all sources: Framework, Local and Namespaced.
   */
  let allPlugins = await LoadPlugins(FrameworkState, LogManager)

  let loadedPlugins = filter((plugin) => {
    return !isCommand(plugin)
  }, allPlugins)

  /*
   * Validates plugin types, values and usage constraints.
   */
  let validatedPlugins = await ValidatePlugins(FrameworkState, LogManager, GlobalInjector, loadedPlugins )

  /*
   * Extract global configuration data from all plugins, including the master required plugin array.
   */
  let FullConfig = await updateFrameworkMeta(LogManager, frameworkMetrics, FutureFrameworkState, validatedPlugins)
  GlobalInjector.anything('PomConfig', FullConfig)
  /*
   * Updates plugins with global state. Attaches all needed properties for downstream use.
   */
  let compPlugins = composePlugins(FullConfig, LogManager, frameworkMetrics, loggerFactory, GlobalInjector)
  let composed = await compPlugins(validatedPlugins)

  // let outdatedTools = reduce((acc, plugin) => {
  //   //@ts-ignore
  //   console.log(plugin.computedMetadata)
  //   return acc
  // }, [],composed)
  /*
   * Validate our current plugins, load config files, ensure directories are available.
   */
  let ensure = EnsureResources(PomConfig, LogManager, frameworkMetrics, GlobalInjector)
  let resourcesEnsured = await ensure(composed)


  /*
   * Override any plugins as needed.
   */
  let readyPlugins = OverridePlugins(LogManager, frameworkMetrics, resourcesEnsured)

  /*
   * Create and populate Magnum-Di child injectors for each plugin.
   */
  let finalPlugins = PopulateInjectors(LogManager, frameworkMetrics,GlobalInjector, FrameworkEvents, readyPlugins)


  /**
   * TODO - Leave this for the CLI
   * @author - Jim Bulkowski
   * @date - 2019-02-21
   * @time - 15:16
   */


  await installPlugins(composed)


  let orderedPlugins = OrderPlugins(LogManager, frameworkMetrics,finalPlugins)


  // Create the Doubly linked list.
  let PList = DLinkedList.fromArray<ComposedPlugin>(orderedPlugins)

  let {runLoadHook, runStartHook, runStopHook} = composeHookRunners(PomConfig, LogManager,GlobalInjector)

  LogManager.use('system').log('Pomegranate Ready.', 2)

  return {
    events: FrameworkEvents,
    externalLog: (method, msg) => {
      LogManager.use('system')[method](msg)
    },
    load: async function runLoadHooks() {
      try {
        rightBar(LogManager.use('system')).run({msg: 'Running Load hooks.'})
        frameworkMetrics.startFrameworkPhase('LoadHook')
        let results = await PList.asyncReduce(async (acc, composedPlugin) => {
          let result = await runLoadHook(composedPlugin);
          (acc.loadedPlugins || (acc.loadedPlugins = [])).push(joinFqShortname(result))

          return acc
        }, RuntimeState)

        LogManager.use('pomegranate').log(`Load Hooks complete with no errors in  ${frameworkMetrics.stopFrameworkPhase('LoadHook')}ms.`, 3)
        LogManager.use('system').log('Pomegranate loaded...',2 )
        return RuntimeState
      } catch (e) {
        RuntimeState.isFailed = true
        RuntimeState.failureError = e
        LogManager.use('pomegranate').error(e.message, 0)
        return RuntimeState
      }
    },
    start: async function runStartHooks() {
      if(RuntimeState.isFailed){
        return RuntimeState
      }
      try {
        rightBar(LogManager.use('system')).run({msg: 'Running Start hooks.'})
        frameworkMetrics.startFrameworkPhase('StartHook')
        let results = await PList.asyncReduce(async (acc, composedPlugin) => {

          if(acc.startFailed){
            (acc.startSkipped || (acc.startSkipped = [])).push(getFqShortname(composedPlugin))
            return acc
          }
          try {
            let result = await runStartHook(composedPlugin);
            (acc.startedPlugins || (acc.startedPlugins = [])).push(joinFqShortname(result))
          }
          catch(e){
            acc.startError = e;
            (acc.startFailed || (acc.startFailed = [])).push(getFqShortname(composedPlugin))
          }

          return acc
        }, RuntimeState)

        if(RuntimeState.startError){
          RuntimeState.isFailed = true
          LogManager.use('pomegranate').error(RuntimeState.startError, 0)
          frameworkLogger.error(`${RuntimeState.startFailed.join()} failed on Start hook.`, 0)
          // frameworkLogger.error('Stop hooks running automatically on started plugins.', 0)
          // return this.stop()
          return RuntimeState
        }

        LogManager.use('pomegranate').log(`Start Hooks complete with no errors in  ${frameworkMetrics.stopFrameworkPhase('StartHook')}ms.`, 3)
        LogManager.use('system').log('Pomegranate started...',2 )
        return RuntimeState
      } catch (e) {
        RuntimeState.isFailed = true
        RuntimeState.failureError = e
        return RuntimeState
      }
    },
    stop: async function runStopHooks() {

      rightBar(LogManager.use('system')).run({msg: 'Running Stop hooks.'})
      frameworkMetrics.startFrameworkPhase('StopHook')

      let startedPlugins = PList.filter((p) => {
        return RuntimeState.startedPlugins.indexOf(getFqShortname(p)) >= 0
      })

      let startedCount = startedPlugins.length
      LogManager.use('pomegranate').log(`Stopping ${startedCount} ${pluginPluralizer(startedCount)}.`, 3)
      let results = await startedPlugins.asyncReduceRight(async (acc, composedPlugin) => {
        try {
          let result = await runStopHook(composedPlugin);
          (acc.stoppedPlugins || (acc.stoppedPlugins = [])).push(joinFqShortname(result))
        }
        catch(e){
          acc.stopError = e;
          (acc.stopFailed || (acc.stopFailed = [])).push(getFqShortname(composedPlugin))
        }
        return acc
      }, RuntimeState)

      LogManager.use('pomegranate').log(`Stop Hooks complete with no errors in  ${frameworkMetrics.stopFrameworkPhase('StopHook')}ms.`, 3)
      LogManager.use('system').log('Pomegranate finished...', 2)
      return RuntimeState
    }
  }

}
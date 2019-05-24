/**
 * @file PopulateInjectors
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {map} from 'lodash/fp'
import {MagnumDI} from "magnum-di";
import {ComposedPlugin} from "../Plugin";
import {PluginTimer} from "../Plugin/Timers";
import {PluginFilesFactory} from "../Plugin/PluginFiles";
import {EventEmitter} from 'events'

import {rightBar} from "../Common/frameworkOutputs";
import {LogManager} from "../FrameworkLogger/LogManager";
// import {getFqShortname, getFqParentname, getFqn} from "@pomegranate/plugin-tools";
import {getFqShortname, getFqParentname, getFqn} from "../Plugin/helpers";

export const PopulateInjectors = (LogManager: LogManager, frameworkMetrics, GlobalInjector: MagnumDI, FrameworkEvents: EventEmitter, composed: ComposedPlugin[]) => {
  rightBar(LogManager.use('system')).run({msg: 'Populating Plugin child injectors'})
  frameworkMetrics.startFrameworkPhase('PopulateInjectors')

  let results = map((plugin) => {
    // let ParentName = getFqParentname(plugin)
    let PluginName = getFqShortname(plugin)
    let FQN = getFqn(plugin)
    plugin.logger.log('Populating Child injector.')
    let ChildInjector = GlobalInjector.createChain(FQN)
    ChildInjector.anything('PluginStore', {})
    ChildInjector.anything('PluginVariables', plugin.runtimeVariables)
    ChildInjector.anything('PluginLogger', plugin.logger)
    ChildInjector.anything('PluginTimer', PluginTimer(plugin.logger, plugin.timeout))
    ChildInjector.anything('PluginLateError', (error) => {
      plugin.logger.error('Encountered a late error.')
      plugin.logger.error(error)
      FrameworkEvents.emit('lateError', {name: PluginName})
    })

    if(plugin.runtimeDirectories){
      plugin.logger.log(`Has directories, adding PluginFiles to the injector.`)
      ChildInjector.anything('PluginFiles', PluginFilesFactory(plugin))
    }
    plugin.injector = ChildInjector
    return plugin

  }, composed)

  LogManager.use('pomegranate').log(`Populated child injectors in ${frameworkMetrics.stopFrameworkPhase('PopulateInjectors')}ms.`, 3)

  return results

}
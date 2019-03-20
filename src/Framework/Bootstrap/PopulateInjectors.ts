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
import {getFqShortname} from "../Plugin/helpers";
import {rightBar} from "../Common/frameworkOutputs";
import {LogManager} from "../FrameworkLogger/LogManager";

export const PopulateInjectors = (LogManager: LogManager, frameworkMetrics, PluginDI: MagnumDI, FrameworkEvents: EventEmitter, composed: ComposedPlugin[]) => {
  rightBar(LogManager.use('system')).run({msg: 'Populating Plugin child injectors'})
  frameworkMetrics.startFrameworkPhase('PopulateInjectors')

  let results = map((plugin) => {
    let PluginName = getFqShortname(plugin)
    plugin.logger.log('Populating Child injector.')
    let ChildInjector = PluginDI.createChild()



    ChildInjector.service('PluginStore', {})
    ChildInjector.service('PluginVariables', plugin.runtimeVariables)
    ChildInjector.service('PluginLogger', plugin.logger)
    ChildInjector.service('PluginTimer', PluginTimer(plugin.logger, plugin.timeout))
    ChildInjector.service('PluginLateError', (error) => {
      plugin.logger.error('Encountered a late error.')
      plugin.logger.error(error)
      FrameworkEvents.emit('lateError', {name: PluginName})
    })

    if(plugin.runtimeDirectories){
      plugin.logger.log(`Has directories, adding PluginFiles to the injector.`)
      ChildInjector.service('PluginFiles', PluginFilesFactory(plugin.runtimeDirectories))
    }
    plugin.injector = ChildInjector
    return plugin

  }, composed)

  LogManager.use('pomegranate').log(`Populated child injectors in ${frameworkMetrics.stopFrameworkPhase('PopulateInjectors')}ms.`, 3)

  return results

}
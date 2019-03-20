import {ValidatedConfiguration} from "../Configuration";
import {PomegranateLogger} from "../FrameworkLogger";
import {MagnumDI} from "magnum-di";
import Bluebird from 'bluebird'
import {ComposedPlugin, ValidatedPlugin} from "../Plugin";
import {FutureState} from "../Common/FutureState";
import {assign, each, toPairs} from "lodash/fp";
import {directoryExists} from "../Configuration/helpers";
import {rightBar} from "../Common/frameworkOutputs";
import {LogManager} from "../FrameworkLogger/LogManager";

/**
 * @file EnsureResources
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

export function EnsureResources(pomConf: ValidatedConfiguration, LogManager: LogManager, frameworkMetrics, PluginInjector: MagnumDI){
  return async function(composedPlugins: ValidatedPlugin[]){
    rightBar(LogManager.use('system')).run({msg: 'Checking plugin resource availability'})
    frameworkMetrics.startFrameworkPhase('EnsureResources')
    return Bluebird.map(composedPlugins, (composed) => {
      return FutureState<ComposedPlugin>(composed)
        .map(async (skeleton, collector) => {
          if(skeleton.runtimeDirectories){
            await Bluebird.each(toPairs(skeleton.runtimeDirectories), async ([key,dirPath]) => {
              await directoryExists(dirPath)
            })
          }
          return collector
        })
        .map((skeleton, collector) => {
          let c = assign(collector, skeleton)
          return c
        })
        .run({})
        .catch((err) => {
          throw err
        })
    })
      .then((result) => {
        LogManager.use('pomegranate').log(`Plugin resource checks took ${frameworkMetrics.stopFrameworkPhase('EnsureResources')}ms.`, 3)
        return result
      })
  }
}


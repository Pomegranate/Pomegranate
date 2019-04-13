/**
 * @file extractMetadata
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import {IFutureState} from "../Common/FutureState";
import {ComposedFrameworkState, RuntimeFrameworkState, ValidatedConfiguration} from ".";
import {ValidatedPlugin} from "../Plugin";
import {filter, map, get, concat, compose, join,assign} from "lodash/fp";
import {getProvidingPlugins} from "../Dependency";
import {getFqShortname} from "../Plugin/helpers";
import {FutureState} from "../Common/FutureState";
import {LogManager} from "../FrameworkLogger/LogManager";

const injectableParams = (pluginArray: ValidatedPlugin[]) => {
  return filter(Boolean,map((plugin) => {
    return getFqShortname(plugin) === plugin.configuration.injectableParam ? null : plugin.configuration.injectableParam
  }, pluginArray))
}

export const updateFrameworkMeta = (LogManager: LogManager, frameworkMetrics, futureConf: IFutureState<RuntimeFrameworkState>, skeletons: ValidatedPlugin[]): Promise<ComposedFrameworkState> => {
  frameworkMetrics.startFrameworkPhase('RuntimeState')
  return futureConf
    .flatMap((currentState, collector) => {
      let c = assign(collector, currentState)
      c.injectableParameters = injectableParams(skeletons)
      c.availablePlugins =  map(getFqShortname, skeletons)
      c.providingPlugins = getProvidingPlugins(skeletons)
      c.allAvailable = concat(c.injectableParameters, c.availablePlugins)
      return FutureState(c)
    })
    .run({})
    .then((results) => {
      LogManager.use('pomegranate').log(`Runtime state creation took ${frameworkMetrics.stopFrameworkPhase('RuntimeState')}ms.`, 3)
      return results
    })
}
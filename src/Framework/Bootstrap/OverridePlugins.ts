/**
 * @file OverridePlugins
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import {ComposedPlugin} from "../Plugin";
import {PomegranateLogger} from "../FrameworkLogger";
import {filter, find, isNull, map, merge, negate, pickBy, keys, concat} from "lodash/fp";
import {getFqShortname} from "../Plugin/helpers";
import {rightBar} from "../Common/frameworkOutputs";
import {LogManager} from "../FrameworkLogger/LogManager";

function onlyOverridePlugins(plugins: ComposedPlugin[]) {
  return filter((plugin) => {
    //@ts-ignore
    return plugin.state.configuration.type === 'override'
  }, plugins)
}

function onlyRuntimePlugins(plugins: ComposedPlugin[]) {
  return filter((plugin) => {
    //@ts-ignore
    let type = plugin.state.configuration.type
    return (type !== 'override')
  }, plugins)
}

export const OverridePlugins = (LogManager: LogManager, frameworkMetrics, composed: ComposedPlugin[]) => {
  rightBar(LogManager.use('system')).run({msg: 'Overriding plugins'})
  frameworkMetrics.startFrameworkPhase('OverridePlugins')
  let overridePlugins = onlyOverridePlugins(composed)
  let runtimePlugins = onlyRuntimePlugins(composed)


  /**
   * TODO - Can probably find the intersection here between override plugins and save some loops.
   * @author - Jim Bulkowski
   * @date - 2019-02-14
   * @time - 12:46
   */


  let overriddenPlugins = map((plugin) => {
    let fqn = getFqShortname(plugin)
    let toOvr = find((p) => {
      return p.overrides === fqn
    }, overridePlugins)

    if(toOvr){
      let onlyHooks = pickBy(negate(isNull), toOvr.hooks)
      let hKys = keys(onlyHooks)
      plugin.logger.warn(`${hKys.length > 1 ? 'Hooks': 'Hook' } - ${keys(onlyHooks).join(', ')} - being overridden by ${getFqShortname(toOvr)}`,1)
      plugin.hooks = merge(plugin.hooks, onlyHooks)
      plugin.runtimeVariables = merge(plugin.runtimeVariables, toOvr.runtimeVariables)
      plugin.runtimeDirectories = merge(plugin.runtimeDirectories, toOvr.runtimeDirectories)
      plugin.configuration.depends = concat(plugin.configuration.depends,toOvr.configuration.depends)
      plugin.configuration.provides = concat(plugin.configuration.provides,toOvr.configuration.provides)
      plugin.configuration.optional = concat(plugin.configuration.optional,toOvr.configuration.optional)
      return plugin
    }
    return plugin
  }, runtimePlugins)

  LogManager.use('pomegranate').log(`Plugin overrides took ${frameworkMetrics.stopFrameworkPhase('OverridePlugins')}ms.`, 3)
  return overriddenPlugins
}
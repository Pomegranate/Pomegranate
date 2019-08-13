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
      //@ts-ignore
      return p.state.overrides === fqn
    }, overridePlugins)

    if(toOvr){
      //@ts-ignore
      let onlyHooks = pickBy(negate(isNull), toOvr.state.hooks)
      let hKys = keys(onlyHooks)
      plugin.logger.warn(`${hKys.length > 1 ? 'Hooks': 'Hook' } - ${keys(onlyHooks).join(', ')} - being overridden by ${getFqShortname(toOvr)}`,1)
      //@ts-ignore
      plugin.state.hooks = merge(plugin.state.hooks, onlyHooks)
      plugin.runtimeVariables = merge(plugin.runtimeVariables, toOvr.runtimeVariables)
      plugin.runtimeDirectories = merge(plugin.runtimeDirectories, toOvr.runtimeDirectories)
      //@ts-ignore
      plugin.state.configuration.depends = concat(plugin.state.configuration.depends,toOvr.state.configuration.depends)
      //@ts-ignore
      plugin.state.configuration.provides = concat(plugin.state.configuration.provides,toOvr.state.configuration.provides)
      //@ts-ignore
      plugin.state.configuration.optional = concat(plugin.state.configuration.optional,toOvr.state.configuration.optional)
      return plugin
    }
    return plugin
  }, runtimePlugins)

  LogManager.use('pomegranate').log(`Plugin overrides took ${frameworkMetrics.stopFrameworkPhase('OverridePlugins')}ms.`, 3)
  return overriddenPlugins
}
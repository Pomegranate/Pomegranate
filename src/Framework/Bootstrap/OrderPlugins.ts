/**
 * @file SortPlugins
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import {sortBy, chunk, map, join} from 'lodash/fp'
import {ComposedPlugin} from "../Plugin";
import {solveOrdering} from "../Common/solveOrdering";
import {getFqShortname} from "../Plugin/helpers";
import {PomegranateLogger} from "../FrameworkLogger";
import {rightBar} from "../Common/frameworkOutputs";
import {LogManager} from "../FrameworkLogger/LogManager";

const formatOrder = (ordered: string[]): string => {
  let by3 = chunk(3, ordered)
  let grouped = map(join(' -> '), by3)
  return `\n\t${join(' -> \n\t', grouped)}`
}

export function OrderPlugins(LogManager: LogManager, frameworkMetrics,plugins: ComposedPlugin[]): ComposedPlugin[]{
  rightBar(LogManager.use('system')).run({msg: 'Ordering Plugins.'})
  frameworkMetrics.startFrameworkPhase('SolveOrdering')

  let order = solveOrdering(plugins)
  LogManager.use('pomegranate').log(`Computed plugin ordering - ${formatOrder(order)}`, 4)

  let sorted = sortBy((plugin): number => {
    return order.indexOf(getFqShortname(plugin))
  }, plugins)

  LogManager.use('pomegranate').log(`Plugin Ordering took ${frameworkMetrics.stopFrameworkPhase('SolveOrdering')}ms.`, 3)
  return sorted
}
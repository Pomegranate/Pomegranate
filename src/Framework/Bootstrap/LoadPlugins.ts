/**
 * @file LoadPlugins
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import {RuntimeFrameworkState, ValidatedConfiguration} from "../Configuration";
import {PomegranateLogger} from "../FrameworkLogger";
import {RequirePlugins} from "../RequirePlugins";
import {rightBar} from "../Common/frameworkOutputs";
import {LogManager} from "../FrameworkLogger/LogManager";


export async function LoadPlugins(PomConfig: RuntimeFrameworkState, LogManager: LogManager) {
  try {
    rightBar(LogManager.use('system')).run({msg: 'Discovering plugin modules.'})
    PomConfig.FrameworkMetrics.startFrameworkPhase('LoadPlugins')
    let loaded = await RequirePlugins(PomConfig, LogManager)
    LogManager.use('pomegranate').log(`Plugin module loading took ${PomConfig.FrameworkMetrics.stopFrameworkPhase('LoadPlugins')}ms.`, 3)
    return loaded
  } catch (e) {
    LogManager.use('pomegranate').error('Plugin Module loading failed.')
    LogManager.use('pomegranate').error(e, 0)

    throw new Error('Pomegranate Startup failed.')
  }

}
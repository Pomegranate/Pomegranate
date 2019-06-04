/**
 * @file LoadPlugins
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import {RuntimeFrameworkState, ValidatedConfiguration} from "../Configuration";
import {ValidatedTransformer} from "../Validation";
import {PomegranateLogger} from "../FrameworkLogger";
import {RequirePlugins} from "../RequirePlugins";
import {rightBar} from "../Common/frameworkOutputs";
import {LogManager} from "../FrameworkLogger/LogManager";
import {Metrics} from "../FrameworkMetrics";


export async function LoadPlugins(FrameworkConfig: any, frameworkMetrics: Metrics, LogManager: LogManager) {
  try {
    rightBar(LogManager.use('system')).run({msg: 'Discovering plugin modules.'})
    frameworkMetrics.startFrameworkPhase('LoadPlugins')
    let loaded = await RequirePlugins(FrameworkConfig, LogManager)
    LogManager.use('pomegranate').log(`Plugin module loading took ${frameworkMetrics.stopFrameworkPhase('LoadPlugins')}ms.`, 3)
    return loaded
  } catch (e) {
    LogManager.use('pomegranate').error('Plugin Module loading failed.')
    LogManager.use('pomegranate').error(e, 0)

    throw new Error('Pomegranate Startup failed.')
  }

}
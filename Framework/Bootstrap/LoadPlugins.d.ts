/**
 * @file LoadPlugins
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import { RuntimeFrameworkState } from "../Configuration";
import { LogManager } from "../FrameworkLogger/LogManager";
export declare function LoadPlugins(PomConfig: RuntimeFrameworkState, LogManager: LogManager): Promise<any[]>;

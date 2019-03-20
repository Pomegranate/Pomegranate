/**
 * @file ValidatePlugins
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import { RuntimeFrameworkState } from "../Configuration";
import { MagnumDI } from "magnum-di";
import { LogManager } from "../FrameworkLogger/LogManager";
export declare function ValidatePlugins(PomConfig: RuntimeFrameworkState, LogManager: LogManager, PluginInjector: MagnumDI, loadedPlugins: any): Promise<any[]>;

/**
 * @file ValidatePlugins
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import { MagnumDI } from "magnum-di";
import { LogManager } from "../FrameworkLogger/LogManager";
import { Metrics } from "../FrameworkMetrics";
export declare function ValidatePlugins(PomConfig: any, frameworkMetrics: Metrics, LogManager: LogManager, GlobalInjector: MagnumDI, loadedPlugins: any): Promise<any[]>;

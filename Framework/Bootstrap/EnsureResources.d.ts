import { ValidatedConfiguration } from "../Configuration";
import { MagnumDI } from "magnum-di";
import { ValidatedPlugin } from "../Plugin";
import { LogManager } from "../FrameworkLogger/LogManager";
/**
 * @file EnsureResources
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
export declare function EnsureResources(pomConf: ValidatedConfiguration, LogManager: LogManager, frameworkMetrics: any, PluginInjector: MagnumDI): (composedPlugins: ValidatedPlugin[]) => Promise<any[]>;

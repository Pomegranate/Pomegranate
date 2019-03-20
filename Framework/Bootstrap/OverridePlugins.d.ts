/**
 * @file OverridePlugins
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import { ComposedPlugin } from "../Plugin";
import { LogManager } from "../FrameworkLogger/LogManager";
export declare const OverridePlugins: (LogManager: LogManager, frameworkMetrics: any, composed: ComposedPlugin[]) => ComposedPlugin[];

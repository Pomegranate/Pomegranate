/**
 * @file RequirePlugins
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import { ValidatedConfiguration } from "./Configuration";
import { LogManager } from "./FrameworkLogger/LogManager";
export declare function RequirePlugins(pomConfig: ValidatedConfiguration, LogManager: LogManager): Promise<any[]>;

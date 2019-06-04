/**
 * @file RequirePlugins
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import { LogManager } from "./FrameworkLogger/LogManager";
import { ValidatedTransformer } from "./Validation";
export declare function RequirePlugins(FrameworkConfiguration: ValidatedTransformer, LogManager: LogManager): Promise<any[]>;

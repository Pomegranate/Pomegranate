/**
 * @file ErrorReporters
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import { ConformError } from "lodash-fun";
import { PomegranateLogger } from "../FrameworkLogger";
export declare function reportEarlyErrors(e: Error | ConformError, rawLogger?: any): void;
export declare function reportCommonErrors(e: Error | ConformError, logger: PomegranateLogger): void;

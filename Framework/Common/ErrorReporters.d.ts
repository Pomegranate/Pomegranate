/**
 * @file ErrorReporters
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import { ConformDeepError } from "lodash-fun";
import { PomegranateLogger } from "../FrameworkLogger";
export declare function reportEarlyErrors(e: Error | ConformDeepError, rawLogger?: any): void;
export declare function reportCommonErrors(e: Error | ConformDeepError, logger: PomegranateLogger): void;

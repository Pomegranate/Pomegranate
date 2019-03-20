/**
 * @file extractMetadata
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import { IFutureState } from "../Common/FutureState";
import { ComposedFrameworkState, RuntimeFrameworkState } from ".";
import { ValidatedPlugin } from "../Plugin";
import { LogManager } from "../FrameworkLogger/LogManager";
export declare const updateFrameworkMeta: (LogManager: LogManager, frameworkMetrics: any, futureConf: IFutureState<RuntimeFrameworkState>, skeletons: ValidatedPlugin[]) => Promise<ComposedFrameworkState>;

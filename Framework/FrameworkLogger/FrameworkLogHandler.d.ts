/**
 * @file FrameworkLogHandler
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import { ValidatedConfiguration } from "../Configuration";
import { LoggerData, LogMessage } from "./LogManager";
export declare const CreateFrameworkLogHandler: (PomConfig: ValidatedConfiguration) => (logMessgage: LogMessage, loggerData: LoggerData) => void;

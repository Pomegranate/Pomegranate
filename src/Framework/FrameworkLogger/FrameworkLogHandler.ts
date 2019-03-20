/**
 * @file FrameworkLogHandler
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import {ValidatedConfiguration} from "../Configuration";
import {LogWrapper} from './index'
import {LoggerData, LogMessage} from "./LogManager";


export const CreateFrameworkLogHandler = (PomConfig: ValidatedConfiguration) => {
  let doLog = LogWrapper(PomConfig.logger, PomConfig.logLevel, PomConfig.colorOutput)
  return (logMessgage: LogMessage, loggerData: LoggerData) => {

    doLog(logMessgage, loggerData)
  }
}
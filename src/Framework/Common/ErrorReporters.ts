/**
 * @file ErrorReporters
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {ConformDeepError, isConformDeepError} from "lodash-fun";
import {fallbackLogger, PomegranateLogger} from "../FrameworkLogger";
import {join, map, truncate} from "lodash/fp";

export function reportEarlyErrors(e: Error | ConformDeepError, rawLogger?: any) {
  let logger = fallbackLogger(rawLogger)
  let append = isConformDeepError(e) ? join('\n', map(i => i.message, e.validationErrors)) : truncate({length: 300}, e.stack)
  let msg = `
  Failed to start before custom logger creation, defaulting to fallback logger.
  This usually indicates a problem in the main configuration file.
  encountered errors - 
  ${append}`
  logger.error(msg)

}

export function reportCommonErrors(e: Error | ConformDeepError, logger: PomegranateLogger){
  let append = isConformDeepError(e) ? join('\n', map(i => i.message, e.validationErrors)) : truncate({length: 250}, e.stack)
  logger.error(`\n${append}`, 0)
}
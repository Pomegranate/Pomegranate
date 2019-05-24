"use strict";
/**
 * @file ErrorReporters
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_fun_1 = require("lodash-fun");
const FrameworkLogger_1 = require("../FrameworkLogger");
const fp_1 = require("lodash/fp");
function reportEarlyErrors(e, rawLogger) {
    let logger = FrameworkLogger_1.fallbackLogger(rawLogger);
    let append = lodash_fun_1.isConformError(e) ? fp_1.join('\n', fp_1.map(i => i.message, e.validationErrors)) : fp_1.truncate({ length: 300 }, e.stack);
    let msg = `
  Failed to start before custom logger creation, defaulting to fallback logger.
  This usually indicates a problem in the main configuration file.
  encountered errors - 
  ${append}`;
    logger.error(msg);
}
exports.reportEarlyErrors = reportEarlyErrors;
function reportCommonErrors(e, logger) {
    let append = lodash_fun_1.isConformError(e) ? fp_1.join('\n', fp_1.map(i => i.message, e.validationErrors)) : fp_1.truncate({ length: 250 }, e.stack);
    logger.error(`\n${append}`, 0);
}
exports.reportCommonErrors = reportCommonErrors;
//# sourceMappingURL=ErrorReporters.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file frameworkOutputs
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
const monet_1 = require("monet");
const fp_1 = require("lodash/fp");
// export const rightBar = (msg: string, separator: string) => {
//   let ln = 80 - msg.length
//   return padEnd([ln, separator], msg)
// }
exports.rightBar = function (pomegranateLogger) {
    return monet_1.Reader(({ msg, skip, separator = '-', logLevel = 1 }) => {
        msg = `${msg} `;
        let ln = 80; //- pomegranateLogger.appendNameLength
        let padded = fp_1.padCharsEnd(separator, ln, msg);
        pomegranateLogger.log(padded, logLevel);
    });
};
//# sourceMappingURL=frameworkOutputs.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file relativeOutputFile
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
const fs_extra_1 = require("fs-extra");
const joinWithBase_1 = require("./joinWithBase");
exports.relativeOutputFile = (basepath) => {
    return (filepath, data, options) => {
        return fs_extra_1.outputFile(joinWithBase_1.joinWithBase(basepath, filepath), data, options);
    };
};
//# sourceMappingURL=relativeOutputFile.js.map
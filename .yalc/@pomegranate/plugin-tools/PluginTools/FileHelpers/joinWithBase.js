"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file joinWithBase
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
const fp_1 = require("lodash/fp");
const path_1 = require("path");
exports.joinWithBase = fp_1.curry((baseDirectory, path) => {
    return path_1.join(baseDirectory, path);
});
exports.manualJoinWithBase = (baseDirectory) => {
    return (...paths) => {
        return path_1.join(baseDirectory, ...paths);
    };
};
//# sourceMappingURL=joinWithBase.js.map
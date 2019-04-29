"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file relativeFileExists
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
const fp_1 = require("lodash/fp");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
exports.relativeFileExists = fp_1.curry((basepath, filepath) => {
    return fs_extra_1.pathExists(path_1.join(basepath, filepath));
});
exports.manualRelativeFileExists = (basepath) => {
    return (...paths) => {
        return fs_extra_1.pathExists(path_1.join(basepath, ...paths));
    };
};
//# sourceMappingURL=relativeFileExists.js.map
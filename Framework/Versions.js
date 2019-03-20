"use strict";
/**
 * @file Versions
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
Object.defineProperty(exports, "__esModule", { value: true });
const __MODULE_VERSIONS_1 = require("./__MODULE_VERSIONS");
const fp_1 = require("lodash/fp");
function Versions(frameworkLogger) {
    fp_1.each(([pkg, version]) => {
        frameworkLogger.log(`Using ${pkg} version ${version}`, 3);
    }, __MODULE_VERSIONS_1.MODULE_VERSIONS);
}
exports.Versions = Versions;
//# sourceMappingURL=Versions.js.map
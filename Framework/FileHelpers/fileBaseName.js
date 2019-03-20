/**
 * @file fileBaseName
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-facade
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fp_1 = require("lodash/fp");
/**
 *
 * @module fileBaseName
 */
exports.fileBaseName = (pathName, uppercase = false) => {
    let fbn = path_1.parse(pathName).name;
    return uppercase ? fp_1.upperFirst(fp_1.toLower(fbn)) : fbn;
};
//# sourceMappingURL=fileBaseName.js.map
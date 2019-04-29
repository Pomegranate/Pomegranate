"use strict";
/**
 * @file ArrayMethods
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project PluginTools
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = require("lodash/fp");
exports.append = fp_1.curry((arr, items) => [...arr, ...items]);
//# sourceMappingURL=ArrayMethods.js.map
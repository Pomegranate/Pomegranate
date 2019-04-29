"use strict";
/**
 * @file GenerateBuilder
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project PluginTools
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = require("lodash/fp");
function checkProp(pluginObject, plugin, prop) {
    if (fp_1.isObject(pluginObject)) {
        throw new Error('A complete object was provided, fluent methods cannot be called on this builder.');
    }
    if (fp_1.has(prop, plugin.state)) {
        throw new Error(`.${prop}() has already been called on this builder.`);
    }
}
exports.checkProp = checkProp;
function createState(builderType, pluginObject, plugin) {
    if (plugin === undefined) {
        return {
            builder: builderType,
            state: pluginObject ? pluginObject : {}
        };
    }
    return plugin;
}
exports.createState = createState;
//# sourceMappingURL=builderMethods.js.map
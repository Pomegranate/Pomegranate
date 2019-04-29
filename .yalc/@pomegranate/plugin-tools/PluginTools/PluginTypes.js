"use strict";
/**
 * @file PluginTypes
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project PluginTools
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
Object.defineProperty(exports, "__esModule", { value: true });
function isPluginDirectory(pluginDirectory) {
    return (pluginDirectory.path !== undefined && pluginDirectory.prop !== undefined);
}
exports.isPluginDirectory = isPluginDirectory;
//# sourceMappingURL=PluginTypes.js.map
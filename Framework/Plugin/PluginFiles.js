"use strict";
/**
 * @file PluginFiles
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = require("lodash/fp");
// import {PluginFileHandler} from "../FileHelpers";
const plugin_tools_1 = require("@pomegranate/plugin-tools");
exports.PluginFilesFactory = (plugin) => {
    let runtimeDirs = plugin.runtimeDirectories;
    let projectDirs = plugin.projectDirectories;
    let runtimePaths = fp_1.toPairs(runtimeDirs);
    let paths = fp_1.map(([key, path]) => {
        return [key, { runtimeDir: path, projectDir: projectDirs[key] }];
    }, runtimePaths);
    let pluginDirs = fp_1.reduce((obj, [key, { runtimeDir, projectDir }]) => {
        obj[key] = plugin_tools_1.PluginFileHandler(runtimeDir, projectDir);
        return obj;
    }, {}, paths);
    return function (prop) {
        let fileHandlers = pluginDirs[prop];
        if (fileHandlers) {
            return fileHandlers;
        }
        throw new Error(`Plugin Directory with property ${prop} does not exist.`);
    };
};
//# sourceMappingURL=PluginFiles.js.map
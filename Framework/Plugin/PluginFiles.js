"use strict";
/**
 * @file PluginFiles
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = require("lodash/fp");
const FileHelpers_1 = require("../FileHelpers");
exports.PluginFilesFactory = (dirs) => {
    let arr = fp_1.toPairs(dirs);
    let pluginDirs = fp_1.reduce((obj, [key, path]) => {
        obj[key] = FileHelpers_1.PluginFileHandler(path);
        return obj;
    }, {}, arr);
    return function (prop) {
        let fileHandlers = pluginDirs[prop];
        if (fileHandlers) {
            return fileHandlers;
        }
        throw new Error(`Plugin Directory with property ${prop} does not exist.`);
    };
};
//# sourceMappingURL=PluginFiles.js.map
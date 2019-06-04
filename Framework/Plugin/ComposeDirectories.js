"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./helpers");
const index_1 = require("./index");
const helpers_2 = require("../Configuration/helpers");
const fp_1 = require("lodash/fp");
/**
 * @file ComposeDirectories
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
exports.ComposeDirectories = (FrameworkConfiguration) => {
    return (skeleton, collector) => {
        if (helpers_1.hasDirectories(skeleton)) {
            // Does the `./application/<ApplicationName>/<PluginName>/ dir exist?
            //@ts-ignore
            let workBasePath = helpers_2.joinBasePath(FrameworkConfiguration.getKey('buildDirs.applicationDirectory'), helpers_1.directoryBasePath(skeleton));
            //@ts-ignore
            let projectBasePath = helpers_2.joinBasePath(FrameworkConfiguration.getKey('projectDirs.applicationDirectory'), helpers_1.directoryBasePath(skeleton));
            let joinToWorkBase = helpers_2.joinBasePath(workBasePath);
            let joinToProjectBase = helpers_2.joinBasePath(projectBasePath);
            let runtimeDirs = fp_1.reduce((acc, directory) => {
                if (index_1.isPluginDirectory(directory)) {
                    acc['runtimeDirs'][directory.prop] = joinToWorkBase(directory.path);
                    acc['projectDirs'][directory.prop] = joinToProjectBase(directory.path);
                    return acc;
                }
                acc['runtimeDirs'][directory] = joinToWorkBase(directory);
                acc['projectDirs'][directory] = joinToProjectBase(directory);
                return acc;
            }, { runtimeDirs: {}, projectDirs: {} }, skeleton.state.directories);
            collector.runtimeDirectories = runtimeDirs.runtimeDirs;
            collector.projectDirectories = runtimeDirs.projectDirs;
            return collector;
        }
        collector.runtimeDirectories = null;
        return collector;
    };
};
//# sourceMappingURL=ComposeDirectories.js.map
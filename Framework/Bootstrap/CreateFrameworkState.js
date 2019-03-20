"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const FutureState_1 = require("../Common/FutureState");
const helpers_1 = require("../Configuration/helpers");
/**
 * @file CreateFrameworkState
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
const directoryExists = (basePath, dirPath, msg) => __awaiter(this, void 0, void 0, function* () {
    try {
        let dir = yield helpers_1.isDirectory(basePath, dirPath);
        return dir;
    }
    catch (err) {
        throw new Error(`${msg} ${err.message}`);
    }
});
function CreateCliState(frameworkLogger, futureConf) {
    return __awaiter(this, void 0, void 0, function* () {
        return futureConf
            .map((skeleton, collector) => __awaiter(this, void 0, void 0, function* () {
            let baseDir = skeleton.baseDirectory;
            let buildDir = yield directoryExists(baseDir, skeleton.buildDirectory, 'config.buildDirectory:');
            let projectDir = yield directoryExists(baseDir, skeleton.projectDirectory, 'config.projectDirectory:');
            collector.baseDirectory = baseDir;
            collector.projectDirectory = projectDir;
            collector.buildDirectory = buildDir;
            collector.projectApplicationDirectory = yield directoryExists(projectDir, skeleton.applicationDirectory, 'config.applicationDirectory');
            collector.projectPluginDirectory = yield directoryExists(projectDir, skeleton.pluginDirectory, 'config.pluginDirectory');
            collector.projectPluginConfigDirectory = yield directoryExists(projectDir, skeleton.pluginConfigDirectory, 'config.pluginConfigDirectory');
            collector.applicationDirectory = yield directoryExists(projectDir, skeleton.applicationDirectory, 'config.applicationDirectory');
            collector.pluginDirectory = yield directoryExists(projectDir, skeleton.pluginDirectory, 'config.pluginDirectory');
            collector.pluginConfigDirectory = yield directoryExists(projectDir, skeleton.pluginConfigDirectory, 'config.pluginConfigDirectory');
            collector.pluginNamespaces = skeleton.pluginNamespaces;
            collector.logger = skeleton.logger;
            collector.logLevel = skeleton.logLevel;
            collector.colorOutput = skeleton.colorOutput;
            collector.timeout = skeleton.timeout;
            collector.pkgDependencies = skeleton.pkgDependencies;
            collector.FrameworkMetrics = skeleton.FrameworkMetrics;
            return collector;
        }))
            .run({})
            .then((result) => {
            return FutureState_1.FutureState(result);
        });
    });
}
exports.CreateCliState = CreateCliState;
function CreateFrameworkState(frameworkLogger, futureConf) {
    return __awaiter(this, void 0, void 0, function* () {
        return futureConf
            .map((skeleton, collector) => __awaiter(this, void 0, void 0, function* () {
            let baseDir = skeleton.baseDirectory;
            //@ts-ignore
            let buildDir = yield directoryExists(baseDir, skeleton.buildDirectory, 'config.buildDirectory:');
            //@ts-ignore
            let projectDir = yield directoryExists(baseDir, skeleton.projectDirectory, 'config.projectDirectory:');
            collector.baseDirectory = baseDir;
            collector.projectDirectory = projectDir;
            collector.buildDirectory = buildDir;
            collector.projectApplicationDirectory = yield directoryExists(projectDir, skeleton.applicationDirectory, 'config.applicationDirectory');
            collector.projectPluginDirectory = yield directoryExists(projectDir, skeleton.pluginDirectory, 'config.pluginDirectory');
            collector.projectPluginConfigDirectory = yield directoryExists(projectDir, skeleton.pluginConfigDirectory, 'config.pluginConfigDirectory');
            collector.applicationDirectory = yield directoryExists(buildDir, skeleton.applicationDirectory, 'config.applicationDirectory');
            collector.pluginDirectory = yield directoryExists(buildDir, skeleton.pluginDirectory, 'config.pluginDirectory');
            collector.pluginConfigDirectory = yield directoryExists(buildDir, skeleton.pluginConfigDirectory, 'config.pluginConfigDirectory');
            collector.pluginNamespaces = skeleton.pluginNamespaces;
            collector.logger = skeleton.logger;
            collector.logLevel = skeleton.logLevel;
            collector.colorOutput = skeleton.colorOutput;
            collector.timeout = skeleton.timeout;
            collector.pkgDependencies = skeleton.pkgDependencies;
            collector.FrameworkMetrics = skeleton.FrameworkMetrics;
            return collector;
        }))
            .run({})
            .then((result) => {
            return FutureState_1.FutureState(result);
        });
    });
}
exports.CreateFrameworkState = CreateFrameworkState;
//# sourceMappingURL=CreateFrameworkState.js.map
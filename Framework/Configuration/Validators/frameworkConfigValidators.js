"use strict";
/**
 * @file frameworkConfigValidators
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = require("lodash/fp");
const helpers_1 = require("../helpers");
const lodash_fun_1 = require("lodash-fun");
const path_1 = require("path");
const directoryExists = (basePath, dirPath, msg) => __awaiter(this, void 0, void 0, function* () {
    try {
        let dir = yield helpers_1.isDirectory(basePath, dirPath);
        return dir;
    }
    catch (err) {
        throw new Error(`${msg} ${err.message}`);
    }
});
exports.frameworkConfigValidators = (basePath) => {
    return {
        buildDirectory: (dirPath) => {
            return fp_1.isString(dirPath) ? dirPath : new Error('config.buildDirectory must be false or a string.');
            // let i = await directoryExists(basePath, dirPath, `config.compileDirectory:`)
            // return i
        },
        projectDirectory: (dirPath) => __awaiter(this, void 0, void 0, function* () {
            return fp_1.isString(dirPath) ? dirPath : new Error('config.projectDirectory must be a string.');
            // let i = await directoryExists(basePath, dirPath, `config.projectDirectory:`)
            // return i
        }),
        applicationDirectory: (dirPath) => __awaiter(this, void 0, void 0, function* () {
            return fp_1.isString(dirPath) ? dirPath : new Error('config.applicationDirectory must be a string.');
            // let i = await directoryExists(basePath, dirPath, `config.applicationDirectory:`)
            // return i
        }),
        pluginDirectory: (dirPath) => __awaiter(this, void 0, void 0, function* () {
            return fp_1.isString(dirPath) ? dirPath : new Error('config.pluginDirectory must be a string.');
            // let i = await directoryExists(basePath, dirPath, `config.pluginDirectory:`)
            // return i
        }),
        pluginConfigDirectory: (dirPath) => __awaiter(this, void 0, void 0, function* () {
            return fp_1.isString(dirPath) ? dirPath : new Error('config.pluginConfigDirectory must be a string.');
            // let i = await directoryExists(basePath, dirPath, `config.pluginConfigDirectory:`)
            // return i
        }),
        pluginNamespaces: (nsarr) => {
            return fp_1.isArray(nsarr) ? nsarr : new Error('config.pluginNamespaces must be an array.');
        },
        logger: (logger) => {
            return lodash_fun_1.hasKeysWith(['log', 'warn', 'info', 'error'], fp_1.isFunction, logger)
                ? logger
                : new Error('config.logger must contain functions for it\'s log, info, warn and error properties');
        },
        logLevel: (level) => {
            if (fp_1.isNull(level)) {
                return 0;
            }
            return (fp_1.inRange(0, 5, level)) ? level : new Error(`config.logLevel must be between 0-4 - Provided: ${level}`);
        },
        colorOutput: (color) => {
            return !!color;
        },
        timeout: (timeout) => {
            return lodash_fun_1.andWith(isFinite, n => n > 0, timeout) ? timeout : new Error(`config.timeout must be a positive integer. - Provided: ${timeout}`);
        },
        baseDirectory: (baseDirectory) => {
            return path_1.normalize(basePath);
        },
        pkgDependencies: (deps) => {
            return !!deps ? deps : require(path_1.join(basePath, 'package.json')).dependencies;
        }
    };
};
//# sourceMappingURL=frameworkConfigValidators.js.map
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
const fp_1 = require("lodash/fp");
const lodash_fun_1 = require("lodash-fun");
const path_1 = require("path");
const helpers_1 = require("../Configuration/helpers");
const helpers_2 = require("../Configuration/helpers");
/**
 * @file FrameworkConfig
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
exports.transformer = (basePath) => {
    let joinBase = helpers_1.joinBP(basePath);
    return {
        buildDirectory: fp_1.identity,
        projectDirectory: fp_1.identity,
        applicationDirectory: fp_1.identity,
        pluginDirectory: fp_1.identity,
        pluginConfigDirectory: fp_1.identity,
        baseDirectory: (val) => {
            return path_1.normalize(basePath);
        },
        projectDirs: {
            base: (val, src) => __awaiter(this, void 0, void 0, function* () {
                return path_1.normalize(path_1.join(basePath, src.projectDirectory));
            }),
            applicationDirectory: (val, src) => __awaiter(this, void 0, void 0, function* () {
                return path_1.normalize(path_1.join(basePath, src.projectDirectory, src.applicationDirectory));
            }),
            pluginDirectory: (val, src) => __awaiter(this, void 0, void 0, function* () {
                return path_1.normalize(path_1.join(basePath, src.projectDirectory, src.pluginDirectory));
            }),
            pluginConfigDirectory: (val, src) => __awaiter(this, void 0, void 0, function* () {
                return path_1.normalize(path_1.join(basePath, src.projectDirectory, src.pluginConfigDirectory));
            }),
        },
        buildDirs: {
            base: (val, src) => __awaiter(this, void 0, void 0, function* () {
                return path_1.normalize(path_1.join(basePath, src.buildDirectory));
            }),
            applicationDirectory: (val, src) => __awaiter(this, void 0, void 0, function* () {
                return path_1.normalize(path_1.join(basePath, src.buildDirectory, src.applicationDirectory));
            }),
            pluginDirectory: (val, src) => __awaiter(this, void 0, void 0, function* () {
                return path_1.normalize(path_1.join(basePath, src.buildDirectory, src.pluginDirectory));
            }),
            pluginConfigDirectory: (val, src) => __awaiter(this, void 0, void 0, function* () {
                return path_1.normalize(path_1.join(basePath, src.buildDirectory, src.pluginConfigDirectory));
            }),
        },
        pluginNamespaces: fp_1.identity,
        logger: fp_1.identity,
        logLevel: fp_1.identity,
        colorOutput: fp_1.identity,
        timeout: fp_1.identity,
        pkgDependencies: (val) => {
            return !!val ? val : require(path_1.join(basePath, 'package.json')).dependencies;
        }
    };
};
exports.conformer = {
    buildDirectory: (val) => {
        return fp_1.isString(val) ? val : new Error('config.buildDirectory must be false or a string.');
    },
    projectDirectory: (val) => __awaiter(this, void 0, void 0, function* () {
        return fp_1.isString(val) ? val : new Error('config.projectDirectory must be a string.');
    }),
    applicationDirectory: (val) => __awaiter(this, void 0, void 0, function* () {
        return fp_1.isString(val) ? val : new Error('config.applicationDirectory must be a string.');
    }),
    pluginDirectory: (val) => __awaiter(this, void 0, void 0, function* () {
        return fp_1.isString(val) ? val : new Error('config.pluginDirectory must be a string.');
    }),
    pluginConfigDirectory: (val) => __awaiter(this, void 0, void 0, function* () {
        return fp_1.isString(val) ? val : new Error('config.pluginConfigDirectory must be a string.');
    }),
    baseDirectory: (val) => {
        return val;
    },
    projectDirs: {
        base: (val, src) => __awaiter(this, void 0, void 0, function* () {
            return yield helpers_2.directoryExists(val);
        }),
        applicationDirectory: (val, src) => __awaiter(this, void 0, void 0, function* () {
            return yield helpers_2.directoryExists(val);
        }),
        pluginDirectory: (val, src) => __awaiter(this, void 0, void 0, function* () {
            return yield helpers_2.directoryExists(val);
        }),
        pluginConfigDirectory: (val, src) => __awaiter(this, void 0, void 0, function* () {
            return yield helpers_2.directoryExists(val);
        }),
    },
    buildDirs: {
        base: (val, src) => __awaiter(this, void 0, void 0, function* () {
            return yield helpers_2.directoryExists(val);
        }),
        applicationDirectory: (val, src) => __awaiter(this, void 0, void 0, function* () {
            return yield helpers_2.directoryExists(val);
        }),
        pluginDirectory: (val, src) => __awaiter(this, void 0, void 0, function* () {
            return yield helpers_2.directoryExists(val);
        }),
        pluginConfigDirectory: (val, src) => __awaiter(this, void 0, void 0, function* () {
            return yield helpers_2.directoryExists(val);
        }),
    },
    pluginNamespaces: (val) => {
        return fp_1.isArray(val) ? val : new Error('config.pluginNamespaces must be an array.');
    },
    logger: (val) => {
        return lodash_fun_1.hasKeysWith(['log', 'warn', 'info', 'error'], fp_1.isFunction, val)
            ? val
            : new Error('config.val must contain functions for it\'s log, info, warn and error properties');
    },
    logLevel: (val) => {
        if (fp_1.isNull(val)) {
            return 0;
        }
        return (fp_1.inRange(0, 5, val)) ? val : new Error(`config.logLevel must be between 0-4 - Provided: ${val}`);
    },
    colorOutput: (val) => {
        return !!val;
    },
    timeout: (val) => {
        return lodash_fun_1.andWith(isFinite, n => n > 0, val) ? val : new Error(`config.timeout must be a positive integer. - Provided: ${val}`);
    },
    pkgDependencies: (val) => {
        return val;
    }
};
//# sourceMappingURL=FrameworkConfig.js.map
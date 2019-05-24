"use strict";
/**
 * @file helpers
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = require("lodash/fp");
const lodash_fun_1 = require("lodash-fun");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const bluebird_1 = __importDefault(require("bluebird"));
const isDir = fp_1.memoize((path) => {
    return fs_extra_1.pathExistsSync(path) && fs_extra_1.statSync(path).isDirectory();
});
exports.joinBP = fp_1.curry((basePath, path) => {
    return path_1.join(path_1.normalize(basePath), path);
});
function joinBasePath(basePath, path) {
    // @ts-ignore
    return exports.joinBP(...arguments);
}
exports.joinBasePath = joinBasePath;
const pathIs = lodash_fun_1.ifElseWith(isDir);
exports.settingPath = (fullPath, confProp) => {
    let setValue = pathIs(fp_1.identity, fp_1.constant(null));
    let setError = pathIs(fp_1.constant(false), fp_1.constant(new Error(`config.${confProp}: ${fullPath} does not exist or is not a directory.`)));
    return fp_1.fromPairs([
        ['value', setValue(fullPath)],
        ['error', setError(fullPath)]
    ]);
};
function joinPluginWorkBase(basepath, workBase) {
    return joinBasePath(basepath, workBase);
}
exports.joinPluginWorkBase = joinPluginWorkBase;
function directoryExists(path) {
    return fs_extra_1.pathExists(path)
        .then((exists) => {
        if (!exists) {
            throw new Error(`Path: ${path} does not exist.`);
        }
        return fs_extra_1.stat(path);
    })
        .then((stats) => {
        if (!stats.isDirectory()) {
            throw new Error(`Path: ${path} is not a directory.`);
        }
        return path;
    });
}
exports.directoryExists = directoryExists;
function isDirectory(basePath, dir) {
    let normal = joinBasePath(basePath, dir);
    return directoryExists(normal);
}
exports.isDirectory = isDirectory;
function requireFile(basePath, filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        let normal = joinBasePath(basePath, filePath);
        let exists = yield fs_extra_1.pathExists(normal);
        if (exists) {
            return require(normal);
        }
    });
}
exports.requireFile = requireFile;
const noExtname = fp_1.filter((f) => {
    return path_1.extname(f) === '';
});
function filterIndexedDirs(pluginDirPath, files) {
    return __awaiter(this, void 0, void 0, function* () {
        let indexDirectories = noExtname(files);
        let dirPathPlugins = yield bluebird_1.default.filter(indexDirectories, (file) => {
            return isDirectory(pluginDirPath, file)
                .then((p) => {
                return fs_extra_1.readdir(p);
            })
                .then((files) => {
                return fp_1.includes('index.js', files);
            });
        });
        return dirPathPlugins;
    });
}
exports.filterIndexedDirs = filterIndexedDirs;
//# sourceMappingURL=helpers.js.map
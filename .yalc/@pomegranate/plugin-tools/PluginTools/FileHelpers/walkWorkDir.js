/**
 * @file walkWorkDir
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-facade
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bluebird_1 = __importDefault(require("bluebird"));
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const fp_1 = require("lodash/fp");
const fileBaseName_1 = require("./fileBaseName");
const defaultOpts = fp_1.defaults({ hidden: false, ext: false });
const isHidden = /^\..*/;
/**
 *
 * @module walkWorkDir
 */
function getBaseName(filePath) {
    return function (uppercase = false) {
        return fileBaseName_1.fileBaseName(filePath, uppercase);
    };
}
function wrapBuildFilePath(filePath, options) {
    return function () {
        return buildFilePath(filePath, options);
    };
}
function buildFilePath(filepath, options) {
    return fs_extra_1.readdir(filepath)
        .then((files) => {
        return bluebird_1.default.filter(files, (file) => {
            if (options.hidden) {
                return true;
            }
            return !isHidden.test(file);
        });
    })
        .then((files) => {
        return bluebird_1.default.map(files, (file) => {
            let p = path_1.join(filepath, file);
            return fs_extra_1.stat(p)
                .then((stat) => {
                if (stat.isDirectory()) {
                    return {
                        path: p,
                        filename: file,
                        directory: true,
                        file: false,
                        walk: wrapBuildFilePath(p, options),
                        getBaseName: getBaseName(p)
                    };
                }
                if (options.ext) {
                    if (path_1.parse(p).ext === options.ext) {
                        return {
                            path: p,
                            filename: file,
                            directory: false,
                            file: true,
                            walk: null,
                            getBaseName: getBaseName(p)
                        };
                    }
                    else {
                        return false;
                    }
                }
                return {
                    path: p,
                    filename: file,
                    directory: false,
                    file: true,
                    walk: null,
                    getBaseName: getBaseName(p)
                };
            });
        });
    })
        .then((files) => {
        return fp_1.filter(Boolean, files);
    })
        .then((files) => {
        return fp_1.reduce((a, b) => {
            return a.concat(b);
        }, [], files);
    });
}
exports.WalkWorkDirPath = (searchPath) => {
    return function walkWorkDir(options = {}) {
        options = defaultOpts(options);
        return buildFilePath(searchPath, options);
    };
};
//# sourceMappingURL=walkWorkDir.js.map
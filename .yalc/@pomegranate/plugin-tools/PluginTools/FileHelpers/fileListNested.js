/**
 * @file fileListNested
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
const hiddenFile = /^\..*/;
function buildFilePath(searchPath, reducer, options) {
    return fs_extra_1.readdir(searchPath)
        .then(function (files) {
        return bluebird_1.default.reduce(files, function (returnObj, file) {
            let sp = path_1.join(searchPath, file);
            if (!options.hidden) {
                let hidden = hiddenFile.test(file);
                if (hidden) {
                    return returnObj;
                }
            }
            return fs_extra_1.stat(sp)
                .then(function (fileStat) {
                if (fileStat.isDirectory()) {
                    let o = returnObj[file] = {};
                    return buildFilePath(sp, o, options)
                        .then(function () {
                        return reducer;
                    });
                }
                if (fileStat.isFile()) {
                    if (options.ext) {
                        let matchesExt = path_1.parse(file).ext === options.ext;
                        if (!matchesExt)
                            return returnObj;
                    }
                    returnObj[fileBaseName_1.fileBaseName(file)] = sp;
                }
                return returnObj;
            });
        }, reducer);
    });
}
exports.fileListNestedFromPath = (searchPath) => {
    return function fileListNested(options = {}) {
        options = defaultOpts(options);
        return buildFilePath(searchPath, {}, options);
    };
};
//# sourceMappingURL=fileListNested.js.map
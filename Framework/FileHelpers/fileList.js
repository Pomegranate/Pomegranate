/**
 * @file fileList
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
// const fileBaseName = require('./fileBaseName')
const defaultOpts = fp_1.defaults({ hidden: false, ext: false, directories: false });
const isHidden = /^\..*/;
/**
 *
 * @module fileList
 */
function getBaseName(filePath) {
    return function (uppercase = false) {
        return fileBaseName_1.fileBaseName(filePath, uppercase);
    };
}
exports.fileListFromPath = (searchPath) => {
    return function (options = {}) {
        options = defaultOpts(options);
        return fs_extra_1.readdir(searchPath)
            .then((files) => {
            if (!options.hidden) {
                files = fp_1.filter((file) => {
                    return !isHidden.test(file);
                }, files);
            }
            if (options.ext) {
                files = fp_1.filter((file) => {
                    return path_1.parse(file).ext === options.ext;
                }, files);
            }
            return bluebird_1.default.filter(files, (file) => {
                return fs_extra_1.stat(path_1.join(searchPath, file))
                    .then((stat) => {
                    if (options.directories)
                        return stat.isDirectory();
                    return stat.isFile();
                });
            }).then((files) => {
                return bluebird_1.default.map(files, (file) => {
                    let filePath = path_1.join(searchPath, file);
                    return {
                        path: filePath,
                        filename: file,
                        getBaseName: getBaseName(filePath)
                    };
                });
            });
        });
    };
};
//# sourceMappingURL=fileList.js.map
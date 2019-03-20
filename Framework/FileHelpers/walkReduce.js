/**
 * @file walkReduce
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
const fp_1 = require("lodash/fp");
const walkWorkDir_1 = require("./walkWorkDir");
const defaultOpts = fp_1.defaults({ hidden: false, ext: false });
const isHidden = /^\..*/;
/**
 *
 * @module walkReduce
 */
function walkReduce(files, reduced, reduceFn = (file) => { return file; }) {
    return bluebird_1.default.reduce(files, (returnObj, file) => {
        if (file.directory) {
            let o = returnObj[file.getBaseName()] = {};
            return file.walk()
                .then((files) => {
                return walkReduce(files, o, reduceFn);
            })
                .then(() => {
                return returnObj;
            });
        }
        return bluebird_1.default.try(() => {
            return reduceFn(file);
        })
            .then((result) => {
            returnObj[file.getBaseName()] = result;
            return returnObj;
        });
    }, reduced);
}
exports.WalkReducePath = (searchPath) => {
    return function fileListDeep(options = {}, reduceFn) {
        options = defaultOpts(options);
        let walkDir = walkWorkDir_1.WalkWorkDirPath(searchPath);
        return walkDir(options)
            .then((files) => {
            return walkReduce(files, {}, reduceFn);
        });
    };
};
//# sourceMappingURL=walkReduce.js.map
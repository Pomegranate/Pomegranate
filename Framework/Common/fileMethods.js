"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = require("lodash/fp");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
/**
 * valueOnPredicate
 *
 * Returns a function that evaluates predicate with value, returning value if true, false otherwise.
 *
 * @param {function} predicate - function to run with value.
 * @returns {function}
 */
exports.valueOnPredicate = (predicate) => {
    if (!fp_1.isFunction(predicate))
        throw new TypeError('Predicate argument must be a function.');
    return fp_1.partial((p, value) => {
        if (p(value)) {
            return value;
        }
        return false;
    }, [predicate]);
};
/**
 * File Handling Transformers
 * @module fileMethods
 */
/**
 * joinPaths
 *
 * returns a partially applied function accepting a further path argument.
 *
 * @param {string[]} basePath
 * @returns {function}
 */
exports.joinPaths = (paths) => fp_1.partial(path_1.join, paths);
/**
 * safeIsDirectory
 *
 * returns false on Error vs throwing.
 *
 * @param {string} fullPath
 * @returns {boolean}
 */
exports.safeIsDirectory = (fullPath) => {
    try {
        return fs_extra_1.statSync(fullPath).isDirectory();
    }
    catch (e) {
        return false;
    }
};
/**
 * safeReadSync
 *
 * returns empty array on Error vs throwing.
 *
 * @param {string} fullPath
 * @returns {*}
 */
exports.safeReadSync = (fullPath) => {
    try {
        return fs_extra_1.readdirSync(fullPath);
    }
    catch (e) {
        return [];
    }
};
/**
 * safeExtname
 *
 * returns empty string on Error vs throwing.
 *
 * @param {string} filePath
 * @returns {*}
 */
exports.safeExtname = (filePath) => {
    try {
        return path_1.extname(filePath);
    }
    catch (e) {
        return '';
    }
};
/**
 * isJsFile
 * @param filePath {string} Full path to a file.
 * @returns {boolean}
 */
exports.isJsFile = (filePath) => exports.safeExtname(filePath) === '.js';
/**
 * hasIndexFile
 * @param {string} Path to a directory
 * @returns {boolean}
 */
exports.hasIndexFile = fp_1.compose(fp_1.some(f => f === 'index.js'), exports.safeReadSync, exports.valueOnPredicate(exports.safeIsDirectory));
//# sourceMappingURL=fileMethods.js.map
/// <reference types="lodash" />
/**
 * valueOnPredicate
 *
 * Returns a function that evaluates predicate with value, returning value if true, false otherwise.
 *
 * @param {function} predicate - function to run with value.
 * @returns {function}
 */
export declare const valueOnPredicate: (predicate?: Function) => import("lodash").Function1<any, any>;
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
export declare const joinPaths: (paths: string[]) => (...args: any[]) => any;
/**
 * safeIsDirectory
 *
 * returns false on Error vs throwing.
 *
 * @param {string} fullPath
 * @returns {boolean}
 */
export declare const safeIsDirectory: (fullPath?: string) => boolean;
/**
 * safeReadSync
 *
 * returns empty array on Error vs throwing.
 *
 * @param {string} fullPath
 * @returns {*}
 */
export declare const safeReadSync: (fullPath?: string) => string[];
/**
 * safeExtname
 *
 * returns empty string on Error vs throwing.
 *
 * @param {string} filePath
 * @returns {*}
 */
export declare const safeExtname: (filePath?: string) => string;
/**
 * isJsFile
 * @param filePath {string} Full path to a file.
 * @returns {boolean}
 */
export declare const isJsFile: (filePath?: string) => boolean;
/**
 * hasIndexFile
 * @param {string} Path to a directory
 * @returns {boolean}
 */
export declare const hasIndexFile: (a1: any) => boolean;

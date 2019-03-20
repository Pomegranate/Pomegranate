import {partial, some, compose, isFunction} from "lodash/fp"
import {statSync, readdirSync} from "fs-extra"
import {join, extname} from "path"

/**
 * valueOnPredicate
 *
 * Returns a function that evaluates predicate with value, returning value if true, false otherwise.
 *
 * @param {function} predicate - function to run with value.
 * @returns {function}
 */
export const valueOnPredicate = (predicate?: Function) => {
  if(!isFunction(predicate)) throw new TypeError('Predicate argument must be a function.')

  return partial((p, value) => {
    if(p(value)) {
      return value
    }
    return false
  }, [predicate])
}

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
export const joinPaths = (paths: string[]) => partial(join, paths)

/**
 * safeIsDirectory
 *
 * returns false on Error vs throwing.
 *
 * @param {string} fullPath
 * @returns {boolean}
 */
export const safeIsDirectory = (fullPath?: string) : boolean => {

  try {return statSync(fullPath).isDirectory()}
  catch(e){return false}
}

/**
 * safeReadSync
 *
 * returns empty array on Error vs throwing.
 *
 * @param {string} fullPath
 * @returns {*}
 */
export const safeReadSync = (fullPath?: string) : string[] => {
  try { return readdirSync(fullPath) }
  catch(e) { return [] }
}

/**
 * safeExtname
 *
 * returns empty string on Error vs throwing.
 *
 * @param {string} filePath
 * @returns {*}
 */
export const safeExtname = (filePath?: string) : string => {
  try {return extname(filePath) }
  catch(e){return ''}
}

/**
 * isJsFile
 * @param filePath {string} Full path to a file.
 * @returns {boolean}
 */
export const isJsFile = (filePath?: string): boolean => safeExtname(filePath) === '.js'

/**
 * hasIndexFile
 * @param {string} Path to a directory
 * @returns {boolean}
 */
export const hasIndexFile = compose(some(f => f === 'index.js'), safeReadSync, valueOnPredicate(safeIsDirectory))


/**
 * @file configTransformer
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {inRange, isArray, isFunction, isNull, isString} from "lodash/fp";
import {andWith, hasKeysWith} from "lodash-fun";
import {join, normalize} from "path";

import {transformKeys} from "lodash-fun";

export const transformer = (basePath) => {
  return {
    buildDirectory: (dirPath)=> {
      return isString(dirPath) ? dirPath : new Error('config.buildDirectory must be false or a string.')
      // let i = await directoryExists(basePath, dirPath, `config.compileDirectory:`)
      // return i
    },
    projectDirectory: async (dirPath)=> {
      return isString(dirPath) ? dirPath : new Error('config.projectDirectory must be a string.')
      // let i = await directoryExists(basePath, dirPath, `config.projectDirectory:`)
      // return i
    },
    applicationDirectory: async (dirPath) => {
      return isString(dirPath) ? dirPath : new Error('config.applicationDirectory must be a string.')
      // let i = await directoryExists(basePath, dirPath, `config.applicationDirectory:`)
      // return i
    },
    pluginDirectory: async (dirPath) => {
      return isString(dirPath) ? dirPath : new Error('config.pluginDirectory must be a string.')
      // let i = await directoryExists(basePath, dirPath, `config.pluginDirectory:`)
      // return i
    },
    pluginConfigDirectory: async (dirPath) => {
      return isString(dirPath) ? dirPath : new Error('config.pluginConfigDirectory must be a string.')
      // let i = await directoryExists(basePath, dirPath, `config.pluginConfigDirectory:`)
      // return i
    },
    pluginNamespaces: (nsarr: string[]) => {
      return isArray(nsarr) ? nsarr : new Error('config.pluginNamespaces must be an array.')
    },
    logger: (logger) => {
      return hasKeysWith(['log', 'warn', 'info', 'error'], isFunction, logger)
        ? logger
        : new Error('config.logger must contain functions for it\'s log, info, warn and error properties')
    },
    logLevel: (level) => {
      if(isNull(level)){ return 0 }
      return (inRange(0,5, level)) ? level : new Error(`config.logLevel must be between 0-4 - Provided: ${level}`)
    },
    colorOutput: (color: boolean) => {
      return !!color
    },
    timeout: (timeout: number) => {
      return andWith(isFinite, n => n > 0, timeout) ? timeout : new Error(`config.timeout must be a positive integer. - Provided: ${timeout}`)
    },
    baseDirectory: (baseDirectory)=>{
      return normalize(basePath)
    },
    pkgDependencies: (deps) => {
      return !!deps ? deps : require(join(basePath, 'package.json')).dependencies
    }
  }
}

export const transformFrameworkConfig = () => {

}
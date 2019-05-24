import {inRange, isArray, isFunction, isNull, isString, identity} from "lodash/fp";
import {andWith, hasKeysWith} from "lodash-fun";
import {join, normalize} from "path";
import {joinBP} from "../Configuration/helpers";
import {directoryExists} from "../Configuration/helpers";

/**
 * @file FrameworkConfig
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

export const transformer = (basePath) => {
  let joinBase = joinBP(basePath)
  return {
    buildDirectory: identity,
    projectDirectory: identity,
    applicationDirectory: identity,
    pluginDirectory: identity,
    pluginConfigDirectory: identity,
    baseDirectory: (val)=>{
      return normalize(basePath)
    },
    projectDirs: {
      base: async (val, src) => {
        return normalize(join(basePath,src.projectDirectory))
      },
      applicationDirectory: async (val, src) => {
        return normalize(join(basePath, src.projectDirectory, src.applicationDirectory))
      },
      pluginDirectory: async (val, src) => {
        return normalize(join(basePath, src.projectDirectory, src.pluginDirectory))
      },
      pluginConfigDirectory: async (val, src) => {
        return normalize(join(basePath, src.projectDirectory, src.pluginConfigDirectory))
      },
    },
    buildDirs: {
      base: async (val, src) => {
        return normalize(join(basePath, src.buildDirectory))
      },
      applicationDirectory: async (val, src) => {
        return normalize(join(basePath, src.buildDirectory, src.applicationDirectory))
      },
      pluginDirectory: async (val, src) => {
        return normalize(join(basePath, src.buildDirectory, src.pluginDirectory))
      },
      pluginConfigDirectory: async (val, src) => {
        return normalize(join(basePath, src.buildDirectory, src.pluginConfigDirectory))
      },
    },
    pluginNamespaces: identity,
    logger: identity,
    logLevel: identity,
    colorOutput: identity,
    timeout: identity,
    pkgDependencies: (val) => {
      return !!val ? val : require(join(basePath, 'package.json')).dependencies
    }
  }
}

export const conformer = {
  buildDirectory: (val)=> {
    return isString(val) ? val : new Error('config.buildDirectory must be false or a string.')
  },
  projectDirectory: async (val)=> {
    return isString(val) ? val : new Error('config.projectDirectory must be a string.')
  },
  applicationDirectory: async (val) => {
    return isString(val) ? val : new Error('config.applicationDirectory must be a string.')
  },
  pluginDirectory: async (val) => {
    return isString(val) ? val : new Error('config.pluginDirectory must be a string.')
  },
  pluginConfigDirectory: async (val) => {
    return isString(val) ? val : new Error('config.pluginConfigDirectory must be a string.')
  },
  baseDirectory: (val)=>{
    return val
  },
  projectDirs: {
    base: async (val, src) => {
      return await directoryExists(val)
    },
    applicationDirectory: async (val, src) => {
      return await directoryExists(val)
    },
    pluginDirectory: async (val, src) => {
      return await directoryExists(val)
    },
    pluginConfigDirectory: async (val, src) => {
      return await directoryExists(val)
    },
  },
  buildDirs: {
    base: async (val, src) => {
      return await directoryExists(val)
    },
    applicationDirectory: async (val, src) => {
      return await directoryExists(val)
    },
    pluginDirectory: async (val, src) => {
      return await directoryExists(val)
    },
    pluginConfigDirectory: async (val, src) => {
      return await directoryExists(val)
    },
  },
  pluginNamespaces: (val: string[]) => {
    return isArray(val) ? val : new Error('config.pluginNamespaces must be an array.')
  },
  logger: (val) => {
    return hasKeysWith(['log', 'warn', 'info', 'error'], isFunction, val)
      ? val
      : new Error('config.val must contain functions for it\'s log, info, warn and error properties')
  },
  logLevel: (val) => {
    if(isNull(val)){ return 0 }
    return (inRange(0,5, val)) ? val : new Error(`config.logLevel must be between 0-4 - Provided: ${val}`)
  },
  colorOutput: (val: boolean) => {
    return !!val
  },
  timeout: (val: number) => {
    return andWith(isFinite, n => n > 0, val) ? val : new Error(`config.timeout must be a positive integer. - Provided: ${val}`)
  },
  pkgDependencies: (val) => {
    return val
  }
}
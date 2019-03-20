/**
 * @file LogManager
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {each, isNumber, last, cloneDeep, get, isString, isFunction, defaultsDeep} from 'lodash/fp'
import {PomegranateLogger} from "./index";
import {defaults} from 'lodash/fp'



export interface LogMessage {
  severity: string,
  verbocity: number,
  messages: any[]
}

export type PomLogger = 'pomegranate'
export type SystemLogger = 'system'

export interface LoggerData {
  source: PomLogger | SystemLogger | string
  appendSource?: boolean
  logLevel?: number
  logFormat?: {
    log?: string[]
    warn?: string[]
    info?: string[]
    error?: string[]
  }
}

export interface LogHandler {
  // (source: string, severity: string, verbocity: number, formatting: string[], messages: any[]): void
  (logMessage: LogMessage, loggerData: LoggerData): void
}

export interface LogManager {
  process: any
  createLogger: (loggerData: LoggerData) => PomegranateLogger
  addHandler: (handler: LogHandler) => void
  use: (source: string) => PomegranateLogger
}

function getVerbArgs(args): [number, any[]] {
  if(isNumber(last(args))){

    // Remove the last argument from the array, so we have the correct array for logging later.
    let rv = args.splice(-1, 1)[0]
    return [rv,args]
  }
  // Default to logLevel 1
  return [1,args]
}

export const DataLogger = (metadata,processor): PomegranateLogger => {
  return {
    metadata: metadata,
    log: (...args) => {
      let [verbocity, messages] = getVerbArgs(args)
      processor({severity: 'log', verbocity, messages}, metadata)
    },
    warn: (...args) => {
      let [verbocity, messages] = getVerbArgs(args)
      processor({severity: 'warn', verbocity, messages}, metadata)
    },
    info: (...args) => {
      let [verbocity, messages] = getVerbArgs(args)
      processor({severity: 'info', verbocity, messages}, metadata)
    },
    error: (...args) => {
      let [verbocity, messages] = getVerbArgs(args)
      processor({severity: 'error', verbocity, messages}, metadata)
    }
  }
}

export interface LogFormatting {
  log?: string[]
  warn?: string[]
  info?: string[]
  error?: string[]

}
export interface LogManagerDefaults {
  logLevel?: number,
  logFormat?: LogFormatting
}
export const PomLogManager = (config?: LogManagerDefaults): LogManager => {
  let conf = defaults({logLevel: 1, logFormat: {log: ['green'], warn: ['yellow'], info: ['cyan'], error: ['red']}}, config)
  let handlers = []
  let loggers = {}

  // const process = (source, severity, verbocity, formatting, messages) => {
  const process = (logMessage: LogMessage, loggerData: LoggerData) => {
    each((handle) => {
      let clonedMessage = cloneDeep(logMessage)
      let clonedData = cloneDeep(loggerData)
      handle(clonedMessage, clonedData)

    }, handlers)
  }
  return {
    process: process,
    createLogger: (loggerData: LoggerData): PomegranateLogger => {
      if(!isString(get('source', loggerData))){
        throw new Error('Cannot create Logger without at minimum a "source" property.')
      }

      let defMeta: LoggerData = defaultsDeep({appendSource: true, logLevel: conf.logLevel, logFormat: conf.logFormat}, loggerData)
      let dl = DataLogger(defMeta, process)
      loggers[defMeta.source] = dl
      return dl
    },
    addHandler: (handler) => {
      if(isFunction(handler)){
        handlers.push(handler)
        return
      }
      throw new Error('Log handler must be a function.')
    },
    use: (source: PomLogger | SystemLogger | string) => {
      return loggers[source]
    }
  }
}
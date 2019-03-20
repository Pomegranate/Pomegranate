/**
 * @file index
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import chalk from 'chalk'
import {isNumber, isString, isFunction,map, last, has, defaults, get, memoize} from 'lodash/fp'
import {ValidatedConfiguration} from "../Configuration";
import {Reader} from 'monet'
import {LoggerData, LogMessage} from "./LogManager";


export interface LogColors {
  log?: string
  warn?: string
  info?: string
  error?: string
}
export interface LoggerConf {
  appendString: string
  logLevel?: number,
  color?: string,
  colors?: LogColors
}

export interface MinimalLogger {
  log: (...args: any) => void
  warn: (...args: any) => void
  info: (...args: any) => void
  error: (...args: any) => void
}

export interface PomegranateLogger extends MinimalLogger {
  appendNameLength?: number
  metadata?: {logLevel: number, formatting: string[]}
  logLevel?: number
  formatting?: string[]
}

/* Losing logged objects to [Object object] was a problem in Pomegranate v5.x
 * This was due to the entire array of arguments being supplied to chalk.
 * this would cast any objects inside to a string, and we all know what that results in.
 *
 * This way we only wrap existing string objects in colors.
 */


const colorWrap = function(color, args){
  return map((item) => {
    if(isString(item)){
      return chalk[color](item)
    }
    return item
  }, args)
}

const createFormatter = memoize((formatStr: string) => {
  let formatter = get(formatStr, chalk)
  if(isFunction(formatter)){
    return formatter
  }

  throw new Error(`${formatStr} is not a valid chalk format.`)

})

let getFormatPath = (method, cObj) => {
  let path = get(method, defaults({log: ['green'], info: ['cyan'], warn: ['yellow'], error: ['red']}, cObj))
  return path ? path.join('.') : (_ => {throw new Error(`Log method ${method} not found in format object.`)})
}
const formatWrap = function(severity,logFormat, args){
  let formatting = getFormatPath(severity,logFormat)
  let color = createFormatter(formatting)
  return map((item) => {
    if(isString(item)){
      return color(item)
    }
    return item
  }, args)
}



export const LogWrapper = (logger, globalLogLevel: number, colorOutput: boolean) => {
  return ({severity, verbocity,messages}: LogMessage, {appendSource, source, logLevel, logFormat}: LoggerData) => {

    let requestedLogLevel = logLevel ? logLevel : globalLogLevel
    if(verbocity > requestedLogLevel){
      return
    }

    if(appendSource){
      messages.unshift(`${source}:`)
    }

    let toLogger = colorOutput ? formatWrap(severity,logFormat,messages) : messages

    logger[severity].apply(logger, toLogger)
  }
}

export const createLogger = (logger, AppendName: string, verbocity: number,colors: LogColors, colorOutput: boolean) => {

  const log = (method, args) => {

    let logLevel = 1
    //Bail early if this log is above the set verbocity
    if(isNumber(last(args))){
      // Remove the last argument from the array, so we have the correct array for logging later.
      logLevel = args.splice(-1, 1)[0]
    }

    if(logLevel > verbocity){
      return
    }

    // Slap our name on the front.
    args.unshift(AppendName)

    /* Losing logged objects to [Object object] was a problem in Pomegranate v5.x
     * This was due to the entire array of arguments being supplied to chalk.
     * this would cast any objects inside to a string, and we all know what that results in.
     *
     * This way we only wrap existing string objects in colors.
     */

    let toLogger = colorOutput ? colorWrap(colors[method], args) : args

    /* Ill admit, Im not sure exactly why this has to be applied, but without it
     * It will log out the color escape codes.
     */
    return logger[method].apply(logger, toLogger)
  }

  return {
    appendNameLength: AppendName.length,
    log(...args){
      return log('log', args)
    },
    warn(...args){
      return log('warn', args)
    },
    error(...args){
      return log('error', args)
    },
    info(...args){
      return log('info', args)
    }
  }
}

export function fallbackLogger(rawLogger = console){
  return createLogger(rawLogger, 'Pomegranate:', 4, {log: 'magenta', info: 'cyan', warn: 'yellow', error: 'red'}, false)
}

export function createLoggerFactory(pomConfig: ValidatedConfiguration, logColor = 'green'): Reader<LoggerConf, PomegranateLogger> {
  let getColors = (cObj) => {
    return defaults({log: logColor, info: 'cyan', warn: 'yellow', error: 'red'}, cObj)
  }

  return Reader((loggerConfig: LoggerConf) => {
    let colors = has('colors', loggerConfig) ? getColors(loggerConfig.colors) : getColors({})
    let logLevel = has('logLevel', loggerConfig) ? loggerConfig.logLevel : pomConfig.logLevel
    return createLogger(pomConfig.logger, loggerConfig.appendString, logLevel, colors, pomConfig.colorOutput)
  })

}
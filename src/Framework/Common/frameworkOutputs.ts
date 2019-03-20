/**
 * @file frameworkOutputs
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import {Reader} from 'monet';
import {padCharsEnd} from 'lodash/fp'
import {PomegranateLogger} from "../FrameworkLogger";


// export const rightBar = (msg: string, separator: string) => {
//   let ln = 80 - msg.length
//   return padEnd([ln, separator], msg)
// }

export const rightBar = function (pomegranateLogger: PomegranateLogger): Reader<any,void> {
  return Reader(({msg, skip,separator = '-', logLevel = 1}: {msg: string, skip?: number,separator?: string, logLevel?: number}) => {
    msg = `${msg} `
    let ln = 80 //- pomegranateLogger.appendNameLength
    let padded = padCharsEnd(separator, ln, msg)
    pomegranateLogger.log(padded, logLevel)
  })
}
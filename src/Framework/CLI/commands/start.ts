/**
 * @file start
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {Argv} from "yargs";
import {join}  from 'path'

import {startPomegranate} from "../handlers/start";


export const command = 'start [path]'
export const aliases = 's'
export const describe = 'Starts a Pomegranate application'
export const builder = (yargs: Argv) => {
  let cwd = process.cwd()
  return yargs
    .positional('path', {
      description: 'path containing a pom.js',
      default: cwd,
      defaultDescription: 'package.json name if available',
      type: 'string'
    })
    .usage('Usage: $0 start [path]')
}
export const handler = startPomegranate
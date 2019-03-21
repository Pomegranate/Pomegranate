/**
 * @file start
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {Argv} from "yargs";
import {join}  from 'path'
import {fork} from 'child_process'


export function startPomegranate(){

  return {
      command: 'start [path]',
      describe: 'Starts a Pomegranate application',
      aliases: 's',
      builder: (yargs: Argv) => {
        let cwd = process.cwd()
        return yargs
          .positional('path', {
            description: 'path containing a pom.js',
            default: cwd,
            defaultDescription: 'Defaults to process.cwd()',
            type: 'string'
          })
          .option('f', {
            alias: 'file',
            description: 'Pom startup file',
            default: 'pom.js',
            defaultDescription: 'pom.js',
            string: true
          })
          .usage('Usage: $0 start [path]')
      },
      handler: (argv) => {
        let file = join(argv.path, argv.file)
        fork(file)
      }
    }
  // return {
  //   command: 'start [path]',
  //   describe: 'Starts a Pomegranate application',
  //   aliases: 's',
  //   builder: (yargs: Argv) => {
  //     let cwd = process.cwd()
  //     return yargs
  //       .positional('path', {
  //         description: 'path containing a pom.js',
  //         default: cwd,
  //         defaultDescription: 'package.json name if available',
  //         type: 'string'
  //       })
  //       .usage('Usage: $0 start [path]')
  //   },
  //   handler: start
  // }
}
/**
 * @file init
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import {Argv} from "yargs";
import {join}  from 'path'

import {init} from "../handlers/init";

export function initPomegranate(PomInstance){
  return {
    command: 'init [name]',
    aliases: 'i',
    describe: 'Initialize a Pomegranate application',
    builder: (yargs: Argv) => {
      let cwd = process.cwd()
      let appName
      try {
        appName = require(join(cwd, 'package.json')).name
      }
      catch(err){
        appName = 'My Pomegranate App'
      }
      return yargs
        .positional('name', {
          description: 'App name',
          default: appName,
          defaultDescription: 'package.json name if available',
          type: 'string'
        })
        .options('f', {
          alias: 'force',
          description: 'Overwrite existing files.',
          default: false,
          boolean: true
        })
        .option('p', {
          alias: 'path',
          description: 'Creation path',
          default: cwd,
          defaultDescription: 'process.cwd()',
          string: true
        })
        .option('d', {
          alias: 'projectDir',
          description: 'Project Directory',
          default: 'PomProject',
          defaultDescription: './PomProject',
          string: true
        })
        .option('b', {
          alias: 'buildDir',
          description: 'Build Directory',
          default: '.PomBuild',
          defaultDescription: './.PomBuild',
          string: true
        })
        .usage('Usage: $0 init [name]')
    },
    handler: init(PomInstance)
  }
}
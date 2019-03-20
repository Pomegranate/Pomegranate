/**
 * @file pomegranate
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {Argv} from 'yargs'
import {join} from 'path'
import {CliData} from "../Pomegranate";

import * as start from './commands/start'
import {plugin} from "./commands/plugin";
import {buildPomegranate} from './commands/build'
import {initPomegranate} from "./commands/init";
import {configurePomegranate} from "./commands/config";

export const pomCli = async (cwd) => {
  let PomegranateSettings
  let PomInstance
  try {
    PomegranateSettings = require(join(cwd, 'PomegranateSettings'))
    PomegranateSettings.logLevel = 0
    PomInstance = await CliData(cwd, PomegranateSettings)
  } catch (err) {
    console.log(err.message)
  }

  let yargs = require('yargs')
  yargs
    .command(initPomegranate(PomInstance))
    .command(buildPomegranate(PomInstance))
    .command(start)
    .command(plugin(PomInstance, PomegranateSettings))
    .command(configurePomegranate(PomInstance))
    .recommendCommands()
    .wrap(yargs.terminalWidth() - (yargs.terminalWidth() * 0.05))
    .demandCommand(1, 'You must provide at least one command.')
    .help()
    // .showHelpOnFail(true)

    .fail((msg, err) => {
      if (msg) {
        console.log(msg)
        yargs.showHelp()
      }
      if (err) {
        console.error(err.message)
      }

      process.exit(1)
    })
    .help()
    .argv

}
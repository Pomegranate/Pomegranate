/**
 * @file pomegranate
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {Argv} from 'yargs'
import {join} from 'path'
import {CliData, crashedCli} from "../Pomegranate";

import {startPomegranate} from './commands/start'
import {plugin} from "./commands/plugin";
import {buildPomegranate} from './commands/build'
import {initPomegranate} from "./commands/init";
import {configurePomegranate} from "./commands/config";

export const pomCli = async (cwd) => {
  let yargs = require('yargs')

  let PomegranateSettings
  let PomInstance
  try {
    PomegranateSettings = require(join(cwd, 'PomegranateSettings'))
    PomInstance = await CliData(cwd, PomegranateSettings)
  }
  catch(err){

  }
  // try {
  //   let PomegranateSettings = require(join(cwd, 'PomegranateSettings'))
  //   PomegranateSettings.logLevel = 4
  //   // PomegranateSettings.logger = {
  //   //   log: () => {},
  //   //   warn: () => {},
  //   //   info: () => {},
  //   //   error: () => {},
  //   // }
  //
  //   let PomInstance = await CliData(cwd, PomegranateSettings)
  //   yargs
  //     .command(initPomegranate(PomInstance))
  //     .command(buildPomegranate(PomInstance))
  //     .command(startPomegranate())
  //     .command(plugin(PomInstance, PomegranateSettings))
  //     .command(configurePomegranate(PomInstance))
  //     .recommendCommands()
  //     .wrap(yargs.terminalWidth() - (yargs.terminalWidth() * 0.05))
  //     .demandCommand(1, 'You must provide at least one command.')
  //     .help()
  //     // .showHelpOnFail(true)
  //
  //     .fail((msg, err) => {
  //       if (msg) {
  //         console.log(msg)
  //         yargs.showHelp()
  //       }
  //       if (err) {
  //         console.error(err.message)
  //       }
  //
  //       process.exit(1)
  //     })
  //     .help()
  //     .argv
  // } catch (err) {
  //   console.log('Pomegranate command mode could not fully instantiate the framework. Limited command set available.')
  //   console.log(err.message)
  //   let PomegranateSettings = require(join(cwd, 'PomegranateSettings'))
  //   PomegranateSettings.logLevel = 0
  //   PomegranateSettings.logger = {
  //     log: () => {},
  //     warn: () => {},
  //     info: () => {},
  //     error: () => {},
  //   }
  //
  //   let LimitedInstance = await crashedCli(cwd, PomegranateSettings)
  //
  //   yargs
  //     .command(initPomegranate(LimitedInstance))
  //     .command(buildPomegranate(LimitedInstance))
  //     .wrap(yargs.terminalWidth() - (yargs.terminalWidth() * 0.05))
  //     .demandCommand(1, 'You must provide at least one command.')
  //     .recommendCommands()
  //     .strict()
  //     .help()
  //     // .showHelpOnFail(true)
  //
  //     .fail((msg, err) => {
  //       console.log(msg)
  //       if (msg) {
  //         yargs.showHelp()
  //       }
  //       if (err) {
  //         console.error(err.message)
  //       }
  //
  //       process.exit(1)
  //     })
  //     .help()
  //     .argv
  //
  // }


  yargs
    .command(initPomegranate(PomInstance))
    .command(buildPomegranate(PomInstance))
    .command(startPomegranate())
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
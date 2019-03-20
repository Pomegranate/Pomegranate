/**
 * @file config
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {Argv} from "yargs";
import yargs from 'yargs'
import {join}  from 'path'
import {buildConfiguration} from "../handlers/buildConfigs";
import {buildProject} from "../handlers/buildProject";
import {configList} from "../handlers/configList";
import {configSet} from "../handlers/configSet";
import {configGet} from "../handlers/configGet";


export function configurePomegranate(PomInstance){
  return {
    command: 'config',
    aliases: 'c',
    describe: 'Configuration management commands',
    builder: (yargs) => {
      return yargs
        .command({
          command: 'list',
          aliases: 'l',
          describe: 'Lists Pomegranate configuration values',
          builder: {},
          handler: configList(PomInstance)
        })
        .command({
          command: 'set <key> <value>',
          aliases: 's',
          describe: 'Sets the value of a Pomegranate config key.',
          builder: {},
          handler: configSet(PomInstance)
        })
        .command({
          command: 'get <key>',
          aliases: 'g',
          describe: 'Gets the value of a Pomegranate config key.',
          builder: {},
          handler: configGet(PomInstance)
        })

        .help()
    },
    handler: () => {
      yargs.showHelp()
    }
  }
}
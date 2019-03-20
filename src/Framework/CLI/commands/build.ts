/**
 * @file init
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import yargs from 'yargs'
import Bluebird from 'bluebird'
import {get} from 'lodash/fp'
import {buildConfiguration} from "../handlers/buildConfigs";
import {buildProject} from "../handlers/buildProject"
import {buildPlugin} from "../handlers/buildPlugin";
import {relative} from 'path'

export const command = 'build <path>'
export const describe = 'Builds Pomegranate app at <path>'
export const aliases = 'b'
export const builder = (yargs) => {
  return yargs
    .command()
    .command({})
    .help()
}
export const handler = (argv) => {

}


export function buildPomegranate(PomInstance) {
  let projectDir = get('Config.projectPluginDirectory', PomInstance)
  let baseDir = get('Config.baseDirectory', PomInstance)

  let defaultPluginDir = relative(baseDir, projectDir)
  return {
    command: 'build',
    aliases: 'b',
    describe: 'generative commands for Pomegranate',
    builder: (yargs) => {
      return yargs
        .command({
          command: 'plugin <builder> <name>',
          aliases: 'pl',
          describe: 'Creates a new local Pomegranate plugin',
          builder: (yargs) => {
            yargs
              .positional('builder', {
                describe: 'The type of builder to use',
                choices: ['injectable','application', 'command'],
                type: 'string'
              })
              .positional('name', {
                describe: 'The plugin name',
                type: 'string'
              })
              .option('f', {
                alias: 'force',
                describe: 'Overwrite existing',
                default: false,
                type: 'boolean'
              })
              .option('t', {
                alias: 'type',
                describe: 'configuration.type of the new plugin',
                default: 'anything',
                choices: ['anything','composite', 'factory', 'instance', 'merge'],
                type: 'string'
              })
              .option('l', {
                alias: 'language',
                describe: 'Generate TypeScript or Javascript',
                default: 'ts',
                choices: ['ts', 'js'],
                type: 'string'
              })
              .option('p', {
                alias: 'path',
                describe: 'Path to write output, defaults to the pluginDirectory in PomegranateSettings.js',
                default: defaultPluginDir,
                type: 'string'
              })
              .option('c', {
                alias: 'comments',
                describe: 'Generates the plugin with usage comments.',
                default: false,
                type: 'boolean'
              })
          },
          handler: buildPlugin(PomInstance)
        })
        .command({
          command: 'config',
          aliases: 'c',
          describe: 'Creates pomegranate plugin configurations',
          builder: (yargs) => {
            yargs.option('e', {
              alias: 'env',
              default: 'false',
              type: 'boolean'
            })
          },
          handler: buildConfiguration(PomInstance)
        })
        .command({
          command: 'project',
          aliases: 'p',
          describe: 'Builds the current project with TypeScript',
          builder: (yargs) => {
            yargs
              .options('c', {
                alias: 'clean',
                description: 'Removes and recreates build directory before compile.',
                default: false,
                boolean: true
              })
              .options('w', {
                alias: 'watch',
                description: 'Watches the project directory for changes.',
                default: false,
                boolean: true
              })
          },
          handler: buildProject(PomInstance)
        })
        .help()
    },
    handler: () => {
      yargs.showHelp()
    }
  }
}
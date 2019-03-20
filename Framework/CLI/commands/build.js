"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file init
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
const yargs_1 = __importDefault(require("yargs"));
const fp_1 = require("lodash/fp");
const buildConfigs_1 = require("../handlers/buildConfigs");
const buildProject_1 = require("../handlers/buildProject");
const buildPlugin_1 = require("../handlers/buildPlugin");
const path_1 = require("path");
exports.command = 'build <path>';
exports.describe = 'Builds Pomegranate app at <path>';
exports.aliases = 'b';
exports.builder = (yargs) => {
    return yargs
        .command()
        .command({})
        .help();
};
exports.handler = (argv) => {
};
function buildPomegranate(PomInstance) {
    let projectDir = fp_1.get('Config.projectPluginDirectory', PomInstance);
    let baseDir = fp_1.get('Config.baseDirectory', PomInstance);
    let defaultPluginDir = path_1.relative(baseDir, projectDir);
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
                        choices: ['injectable', 'application', 'command'],
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
                        choices: ['anything', 'composite', 'factory', 'instance', 'merge'],
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
                    });
                },
                handler: buildPlugin_1.buildPlugin(PomInstance)
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
                    });
                },
                handler: buildConfigs_1.buildConfiguration(PomInstance)
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
                    });
                },
                handler: buildProject_1.buildProject(PomInstance)
            })
                .help();
        },
        handler: () => {
            yargs_1.default.showHelp();
        }
    };
}
exports.buildPomegranate = buildPomegranate;
//# sourceMappingURL=build.js.map
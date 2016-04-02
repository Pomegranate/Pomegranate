#!/usr/bin/env node

var mkdirp = require('mkdirp');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var PluginSettingsTmpl = require('./templates/pluginSettingsObject');

var yargs = require('yargs')
var argv = yargs
  .usage('usage: $0 <command>')
  .version(function() {
    var version = require('../package').version
    return 'Pomegranate ' + version;
  })
  .demand(1, 'Requires init, build or start argument.')
  .command('init', 'create a new Pomegranate project.', function(yargs) {
    argv = yargs
      .usage('usage: $0 init <name> [options]')
      .demand(2, 'Requires a path option.')
      .options('f', {
        alias: 'force',
        default: false,
        description: 'Overwrites existing settings and startup file.',
        type: 'boolean'
      })
      .options('n', {
        alias: 'name',
        default: 'Default-App',
        description: 'application name',
        type: 'string'
      })
      .help('help')
      .wrap(null)
      .argv

    if(checkCommands(yargs, argv, 2)) {
      return require('./commands/init')(argv);
    }
  })
  .command('build', 'Creates plugin directories and config files.', function(yargs) {
    argv = yargs
      .usage('usage: $0 build')
      .options('c', {
        alias: 'config',
        describe: 'Path to framework config',
        default: './PomegranateSettings.js',
        type: 'string'
      })
      .options('f', {
        alias: 'force',
        describe: 'Rewrite Plugin configs with default values.',
        default: false,
        type: 'boolean'
      })
      .options('e', {
        alias: 'envs',
        describe: 'Generates plugin setting files that export a function with access to the Environment dependency "Env".',
        default: false,
        type: 'boolean'
      })
      .help('help')
      .wrap(null)
      .argv

    if(checkCommands(yargs, argv, 1)) {
      //build(argv)
      return require('./commands/build')(argv);
    }
  })
  .command('start', 'Starts the pomegranate framework in the current working directory.', function(yargs) {
    argv = yargs
      .usage('usage: $0 start')
      .options('c', {
        alias: 'config',
        describe: 'Name of main framework file to run.',
        default: './pom.js',
        type: 'string'
      })
      .help('help')
      .wrap(null)
      .argv

    if(checkCommands(yargs, argv, 1)) {
      return require('./commands/start')(argv);
    }
  })
  .help('help')
  .wrap(null)
  .argv

function checkCommands(yargs, argv, numRequired) {
  if(argv._.length < numRequired) {
    yargs.showHelp()
    return false
  }
  return true
}

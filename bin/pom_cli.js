#!/usr/bin/env node

var mkdirp = require('mkdirp');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');


var yargs = require('yargs')
var argv = yargs
  .usage('usage: $0 <command>')
  .demand(1, 'Requires init, build or start argument.')
  .command('init', 'create a new Pomegranate project.', function(yargs) {
    argv = yargs
      .usage('usage: $0 init <name> [options]')
      .demand(2, 'Requires a path option.')
      .options('f', {
        alias: 'force',
        default: false,
        description: 'Runs in a non empty directory.',
        type: 'boolean'
      })
      .help('help')
      .wrap(null)
      .argv

    if(checkCommands(yargs, argv, 2)) {
      init(argv)
    }
  })
  .command('build', 'Creates plugin directories and config files.', function(yargs) {
    argv = yargs
      .usage('usage: $0 build')
      .options('c', {
        alias: 'config',
        describe: 'Path to framework config',
        default: './FrameworkSettings.js',
        type: 'string'
      })
      .options('f', {
        alias: 'force',
        describe: 'Rewrite Plugin configs with default values.',
        default: false,
        type: 'boolean'
      })
      .options('s', {
        alias: 'stale',
        describe: 'Removes config properties that no longer have a plugin associated.',
        default: false,
        type: 'boolean'
      })
      .help('help')
      .wrap(null)
      .argv

    if(checkCommands(yargs, argv, 1)) {
      build(argv)
    }
  })
  .command('start', 'list items in project', function(yargs) {
    argv = yargs
      .usage('usage: $0 start')
      .help('help')
      .wrap(null)
      .argv

    if(checkCommands(yargs, argv, 2)) {

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

function init(args) {
  var path = args._.pop()
  isEmpty(path, function(empty) {
    if(empty || args.force) {
      return createPomegranateApp(path)
    }
    return console.log('Directory Exists: rerun with "pomegranate init -f ' + path + '" to force')
  })
}

function build(args) {
  createPluginConfig(args)
}

function start(args) {
  console.log('Starting')
}

function isEmpty(path, cb) {
  fs.readdir(path, function(err, files) {
    if(err && 'ENOENT' != err.code) throw err;
    cb(!files || !files.length);
  });
}

function isDirectory(path, cb){
  fs.stat(path, function(err, stats) {
    if(err) throw err;
    cb(stats.isDirectory())
  })
}

function mkdir(path, cb) {
  mkdirp(path, 0755, function(err) {
    if(err) throw err;
    console.log('Creating directory: ' + path)
    cb && cb()
  })
}

function write(f) {
  fs.writeFile(f.path, f.file)
  console.log('Creating file: ' + f.path);
}

function createPomegranateApp(path) {
  mkdir(path, function() {
    var appTemplate = {
      file: require('./appTemplate')(path),
      path: path + '/pom.js'
    };
    var pluginSettings = {
      file: require('./pluginSettings')(path, {}),
      path: path + '/PluginSettings.js'
    };
    var frameworkSettings = {
      file: require('./frameworkSettings')(path, './PluginSettings.js'),
      path: path + '/PomegranateSettings.js'
    };

    write(appTemplate);
    write(frameworkSettings);
    write(pluginSettings);
    mkdir(path + '/plugins');

  })
}

function createPluginConfig(args) {

  var configPath = path.join(process.cwd(), 'PomegranateSettings');
  var packagePath = path.join(process.cwd(), 'package.json');
  var pluginOptions = path.join(process.cwd(), 'PluginSettings.js');
  var FrameworkOptions = require(configPath);
  var PkgJson = require(packagePath);
  var CurrentPluginSettings = require(pluginOptions)

  var immutableOptions = {
    prefix: 'pomegranate',
    parentDirectory: process.cwd(),
    layers: ['core', 'data', 'dependency', 'pre_router', 'router', 'post_router', 'server']
  };
  var mergedOptions = _.chain(FrameworkOptions).omit('prefix', 'layers').merge(immutableOptions).value();
  mergedOptions.pluginDirectory = path.join(mergedOptions.parentDirectory, mergedOptions.pluginDirectory);
  var Loader = require('magnum-loader');
  var loader = Loader(PkgJson, mergedOptions, pluginOptions)
  var defaultConfigs = loader.getPluginConfigs({stringify: false, defaults: true});


  var existingConfigKeys = _.keys(CurrentPluginSettings);
  var returnedConfigKeys = _.keys(defaultConfigs);
  var removeStale = _.difference(existingConfigKeys, returnedConfigKeys);
  var newConfigs = _.omit(defaultConfigs, existingConfigKeys);

  var m = _.merge(CurrentPluginSettings, newConfigs);
  if(args.stale)
    m = _.omit(m, removeStale)

  var pluginSettings = {
    file: require('./pluginSettings')('PluginSettings', m),
    path: pluginOptions
  };
  createPluginWorkdirs(defaultConfigs,mergedOptions.parentDirectory, function(){
    write(pluginSettings)
  })

}

function createPluginWorkdirs(defaultConfigs, parentDirectory, cb) {
  var dirs = _.chain(defaultConfigs)
    .mapValues(function(o) {
      return o.workDir || false
    })
    .values()
    .filter(Boolean)
    .value()
  var count = dirs.length;
  var allDone = function(){
    if(!--count){
      cb()
    }
  };

  _.each(dirs, function(dir) {
    isDirectory(dir, function(isDir){
      if(isDir){
        console.log(dir + ' Directory exists')
        allDone()
      } else {
        console.log('Create directory here.');
        mkdir(dir, allDone);
      }

    })
  })

}
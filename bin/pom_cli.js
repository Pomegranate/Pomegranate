#!/usr/bin/env node

var mkdirp = require('mkdirp');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');


var yargs = require('yargs')
var argv = yargs
  .usage('usage: $0 <command>')
  .version(function(){
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
        default: './PomegranateSettings.js',
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

    if(checkCommands(yargs, argv, 1)) {
      require(path.join(process.cwd(), 'pom.js'))
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

  var path = args._[args._.length - 1];
  isEmpty(path, function(empty) {
    if(empty || args.force) {
      return createPomegranateApp(args)
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

function createPomegranateApp(args) {

  var path = args._.pop()

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

function createPluginConfig(args){
  var Config = require(path.join(process.cwd(), args.config));
  Config.verbose = false;
  var Pomegranate = require('../')
  var pom = Pomegranate(Config)
  pom.on('ready', function(){
    buildConfig(pom.getDefaultConfigs(), pom.getProvidedConfigs())
  });
}

function buildConfig(defaultConf, providedConf, stale){

  var existingConfigKeys = _.keys(providedConf.options);
  var returnedConfigKeys = _.keys(defaultConf);
  var removeStale = _.difference(existingConfigKeys, returnedConfigKeys);
  var newConfigs = _.omit(defaultConf, existingConfigKeys);

  var merged = _.merge(providedConf.options, newConfigs);
  if(stale) {
    merged = _.omit(merged, removeStale)
  }

  var pluginSettings = {
    file: require('./pluginSettings')('PluginSettings', merged),
    path: providedConf.path
  };
  write(pluginSettings, 'Writing Plugin configs to');
  createPluginWorkdirs(defaultConf, providedConf.parentDirectory, function(err, message){
    console.log(message);
  })
}

function createPluginWorkdirs(defaultConfigs, parentDirectory, cb) {

  var dirs = _.chain(defaultConfigs)
    .mapValues(function(o) {
      return o.workDir || _.chain(o).mapValues(function(v){
          return v.workDir || false
        }).values().filter(Boolean).value()
    })
    .values().filter(Boolean).flatten().value();

  var count = dirs.length;

  if(!count){
    return cb('No plugin directories to create.')
  }

  var allDone = function(){
    if(!--count){
      cb(null, 'Created plugin work directories.')
    }
  };

  _.each(dirs, function(dir) {
    isDirectory(dir, function(isDir){
      if(isDir){
        console.log(dir + ' Directory exists')
        allDone()
      } else {
        mkdir(dir, allDone);
      }
    })
  })

}

function isEmpty(path, cb) {
  fs.readdir(path, function(err, files) {
    if(err && 'ENOENT' != err.code) throw err;
    cb(!files || !files.length);
  });
}

function isDirectory(path, cb){
  fs.stat(path, function(err, stats) {
    if(err && 'ENOENT' != err.code) throw err;
    if(err){
      return cb(false)
    }
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

function write(f, message) {
  message = message || 'Creating';
  fs.writeFile(f.path, f.file);
  console.log(message + ' file: ' + f.path);
}
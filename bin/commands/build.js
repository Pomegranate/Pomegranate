/**
 * @file build
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
var fileHelpers = require('../helpers/fileHelpers');
var path = require('path');
var fs = require('fs');
var _ = require('lodash')
/**
 *
 * @module build
 */

module.exports = function createPluginConfig(args) {
  var Config = require(path.join(process.cwd(), args.config));
  Config.verbose = false;
  var Pomegranate = require('../../')
  var pom = Pomegranate(Config)
  pom.on('ready', function() {
    var defaultConfiguration = pom.getDefaultConfigs();
    var applicationDirectory = Config.applicationDirectory;
    createPluginConfigurations(Config.pluginSettingsDirectory, defaultConfiguration, function() {
      createPluginWorkdirs(defaultConfiguration, applicationDirectory, function(err, message) {
        console.log(message);
      })
    })
  });
}

function createPluginWorkdirs(defaultConfigs, applicationDirectory, cb) {

  var dirs = _.chain(defaultConfigs)
    .mapValues(function(o) {
      return o.workDir || _.chain(o).mapValues(function(v) {
          if(_.isNull(v)) {
            return false
          }
          return v.workDir || false
        }).values().filter(Boolean).value()
    })
    .values().filter(Boolean).flatten().value();

  var count = dirs.length;
  var created = false;

  if(!count) {
    return cb('No plugin directories to create.')
  }

  var allDone = function() {
    if(!--count) {
      var message = created ? 'Created plugin work directories.' : 'No directories created.'
      cb(null, message)
    }
  };

  _.chain(dirs)
    .map(function(dir) {
      return path.join(process.cwd(),applicationDirectory, dir);
    })
    .each(function(dir) {
      fileHelpers.isDirectory(dir, function(isDir) {
        if(isDir) {
          console.log('./' + path.relative(process.cwd(), dir) + ' Directory exists')
          allDone()
        }
        else {
          fileHelpers.mkdir(dir, allDone);
        }
      })
    }).value()

}

function createPluginConfigurations(pluginConfigDir, defaultConfig, cb) {
  pluginConfigDir = path.join(process.cwd(), pluginConfigDir);
  var count = Object.keys(defaultConfig).length;

  fileHelpers.isDirectory(pluginConfigDir, function(exists) {
    if(!exists) {
      return fileHelpers.mkdir(pluginConfigDir, writeConfigFiles)
    }
    return writeConfigFiles(null)
  })

  //Create our plugins configuration files.
  function writeConfigFiles(err) {
    if(err) throw err

    _.mapValues(defaultConfig, function(v, k) {
      var pluginSettings = {
        file: require('../templates/pluginSettings')(k, v),
        path: path.join(pluginConfigDir, k + '.js')
      };
      fs.stat(pluginSettings.path, function(err, stats) {
        if(err && err.code === 'ENOENT') {
          fileHelpers.write(pluginSettings, 'Writing Plugin configs to', allDone);
        }
        else {
          console.log('Skipping existing file ./' + path.relative(process.cwd(), pluginSettings.path))
          allDone()
        }
      });
    })
  }

  function allDone() {
    if(!--count) {
      cb && cb()
    }
  }
}
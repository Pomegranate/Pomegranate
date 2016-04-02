/**
 * @file init
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
var fileHelpers = require('../helpers/fileHelpers');
/**
 *
 * @module init
 */

module.exports = function init(args) {

  var path = args._[args._.length - 1];

  fileHelpers.isEmpty(path, function(empty) {
    if(empty || args.force) {
      return fileHelpers.mkdir(path, function() {
        return createPomegranateApp(args)
      })
    }
    console.log(path + ' Directory Exists: rerun with "pomegranate init -f ' + path + '" to force')
    return createPomegranateApp(args)
  })
}

function createPomegranateApp(args) {
  var path = args._.pop()

  var appTemplate = {
    file: require('../templates/appTemplate')(args.name),
    path: path + '/pom.js'
  };
  var frameworkSettings = {
    file: require('../templates/frameworkSettings')(args.name, './pluginSettings'),
    path: path + '/PomegranateSettings.js'
  };

  fileHelpers.isFile(appTemplate.path, function(exists) {
    if(!exists || args.force) {
      return fileHelpers.write(appTemplate);
    }
    console.log(appTemplate.path + ' exists, skipping.');
  })

  fileHelpers.isFile(frameworkSettings.path, function(exists) {
    if(!exists || args.force) {
      return fileHelpers.write(frameworkSettings);
    }
    console.log(frameworkSettings.path + ' exists, skipping.');
  })

  fileHelpers.isDirectory(path + '/plugins', function(exists) {
    if(!exists || args.force) {
      return fileHelpers.mkdir(path + '/plugins');
    }
    console.log(path + '/plugins directory exists, skipping.')
  })
}
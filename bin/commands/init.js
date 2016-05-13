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

  console.log('Creating Pomegranate application.\n');

  fileHelpers.isEmpty(path, function(empty) {
    if(empty || args.force) {
      return fileHelpers.mkdir(path, function() {
        return createPomegranateApp(args)
      })
    }
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

  var count = 3
  function allDone(){
    count -= 1;
    if(!count){
      console.log('\n' +
        'Pomegranate installation finished, you can now run \n' +
        '-- pomegranate build -e -- \n' +
        'to generate config files for installed plugins.');
    }
  }

  fileHelpers.isFile(appTemplate.path, function(exists) {
    if(!exists || args.force) {
      return fileHelpers.write(appTemplate, null, allDone);
    }
    console.log(appTemplate.path + ' exists, skipping.');
    allDone()
  })

  fileHelpers.isFile(frameworkSettings.path, function(exists) {
    if(!exists || args.force) {
      return fileHelpers.write(frameworkSettings, null, allDone);
    }
    console.log(frameworkSettings.path + ' exists, skipping.');
    allDone()
  })

  fileHelpers.isDirectory(path + '/plugins', function(exists) {
    if(!exists || args.force) {
      return fileHelpers.mkdir(path + '/plugins', allDone());
    }
    console.log(path + '/plugins directory exists, skipping.')
    allDone()
  })
}

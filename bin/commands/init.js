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
      return createPomegranateApp(args)
    }
    return console.log('Directory Exists: rerun with "pomegranate init -f ' + path + '" to force')
  })
}

function createPomegranateApp(args) {
  var path = args._.pop()

  fileHelpers.mkdir(path, function() {
    var appTemplate = {
      file: require('../templates/appTemplate')(path),
      path: path + '/pom.js'
    };
    var frameworkSettings = {
      file: require('../templates/frameworkSettings')(path, './pluginSettings'),
      path: path + '/PomegranateSettings.js'
    };

    fileHelpers.write(appTemplate);
    fileHelpers.write(frameworkSettings);
    fileHelpers.mkdir(path + '/plugins');
  })
}
/**
 * @file applicationSettings
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate-testbed
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

var stringifyObject = require('stringify-object');

module.exports = function(appName, pluginOptionsFile) {
  var EOL = require('os').EOL;

  var file = [
    '/* ',
    ' * Framework and Plugin Settings for ' + appName ,
    ' */',
    '',
    'module.exports = {',
    '  pluginDirectory: \'./plugins\',',
    '  pluginOptions: \'' + pluginOptionsFile + '\',',
    '  additionalLayers: false,',
    '  logger: console,',
    '  timeout: 2000,',
    '  verbose: true,',
    '  colors: true',
    '}'
  ].join(EOL)
  return file
}
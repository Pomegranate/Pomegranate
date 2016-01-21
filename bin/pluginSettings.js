/**
 * @file pluginSettings
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate-testbed
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

var stringifyObject = require('stringify-object');

module.exports = function(appName, exportObj) {
  var objString = stringifyObject(exportObj, {indent: '  ', singleQuotes: true})
  objString = 'module.exports = ' + objString + ';';

  var EOL = require('os').EOL
  var file = [
    '/* ',
    ' * Plugin Settings for ' + appName ,
    ' */',
    ''
  ].concat(objString).join(EOL)
  return file
}
/**
 * @file pluginSettings
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate-testbed
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

var stringifyObject = require('stringify-object');

module.exports = function(pluginName, exportObj) {
  var objString = stringifyObject(exportObj, {indent: '  ', singleQuotes: true})
  objString = 'exports.'+ pluginName +' = ' + objString + ';';

  var EOL = require('os').EOL
  var file = [
    '/* ',
    ' * Settings for plugin -- ' + pluginName ,
    ' */',
    ''
  ].concat(objString).join(EOL)
  return file
}
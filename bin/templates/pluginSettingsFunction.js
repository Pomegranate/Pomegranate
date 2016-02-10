/**
 * @file pluginSettingsFunction
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
'use strict';

var stringifyObject = require('stringify-object');
var _ = require('lodash');

module.exports = function(pluginName, exportObj) {
  var EOL = require('os').EOL
  var objString = stringifyObject(exportObj, {indent: '  ', singleQuotes: true})
  var paddedObj = _.map(objString.split('\n'), function(line, index){
    if(index > 0) {
      return '  ' + line
    }
    return line
  }).join(EOL);

  var functionString = [
    'exports.'+ pluginName +' = function(Env){',
    '  return '+ paddedObj,
    '}'
  ];

  var file = [
    '/* ',
    ' * ' + pluginName + ' -- Settings',
    ' *',
    ' * The Env parameter in the exported function below refers to process.env',
    ' * Feel free to use it as such.',
    ' */',
    ''
  ].concat(functionString).join(EOL)
  return file
}
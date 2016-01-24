/**
 * @file appTemplate
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate-testbed
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

module.exports = function(appName) {
  var EOL = require('os').EOL
  var file = [
    '/* ',
    ' * Pomegranate application ' + appName ,
    ' */',
    '',
    'var Pomegranate = require(\'pomegranate\');',
    'var FrameworkOptions = require(\'./PomegranateSettings\');',
    '',
    'var pom = Pomegranate(FrameworkOptions);',
    '',
    'pom.start();'
  ].join(EOL)
  return file
}
/**
 * @file start
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
var path = require('path');
/**
 *
 * @module start
 */

module.exports = function(args){
  var pomIndex = path.join(process.cwd(), args.config)
  require(pomIndex)
}
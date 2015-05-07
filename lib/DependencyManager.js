/**
 * @file DependencyManager
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

var _ = require('lodash');
var Router = require('express').Router
/**
 * Pomegranate DI framework.
 * @module DependencyManager
 */

var DependencyManager = (function() {
  var dependencies = {}
  return {
    register: function(name, item){
      dependencies[name] = item
    },
    inject: function(fn) {
      var FUNC_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
      var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
      var args = fn.toString().match(FUNC_ARGS)[1].split(',');
      var depArray = _.map(args, function(arg) {
        arg = arg.replace(/[\s\r\n]+/, '');
        if(arg === "Router") {
          return Router()
        }
        var injectDep = dependencies[arg]
        if(_.isUndefined(injectDep)) {
          return null
        }
        return injectDep
      });
      return fn.apply(fn, depArray)
    },
    get: function(name) {
      return dependencies[name];
    }
  };
})();

module.exports = DependencyManager
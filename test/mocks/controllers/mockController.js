/**
 * @file mockController
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

/**
 *
 * @module mockController
 */

module.exports = function(factory, service){
  return {
    callFactory: function(){
      return factory()
    },

    returnService: function() {
      return service;
    }
  }
}
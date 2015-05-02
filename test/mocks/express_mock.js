/**
 * @file express_mock
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

/**
 * Mocks out express.js
 * @module express_mock
 */

module.exports = {
  setup: function(){
    this.routes = [];
    return this;
  },
  use: function(path, router) {
    this.routes.push(path)
  }
};
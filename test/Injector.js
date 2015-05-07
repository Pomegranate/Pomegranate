/**
 * @file Injector
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */


var should = require('should');
var path = require('path')
var expressMock = require('./mocks/express_mock').setup();

var injector = require('../lib/DependencyManager');

describe('Injector should work as designed.', function(){

  describe('should register and return things', function() {
    it('Should be an object', function() {
      injector.register('A', {})
    })

  });
});
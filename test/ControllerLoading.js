/**
 * @file ControllerLoading
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

var should = require('should');
var path = require('path')

var injector = require('magnum-di');
var loggerMock = require('./mocks/logger_mock');
var controllerDir = path.join(__dirname,'./mocks/controllers');

injector.service('service', {a: true, b: 'pass'})
injector.factory('factory', function(){
  return function(){
    return {factory: 'pass'}
  }

})

var controllers = require('../lib/DataServices/ControllerLoader')(injector, {controllers: controllerDir}, loggerMock);
var mock;

describe('Controllers should load', function(){

  describe('Injector should contain the correct values', function() {
    it('injector should get the \"mockController\" object', function() {
      mock = injector.get('mockController');
      mock.should.be.type('object')
    })

    it('should have callInstance and returnService functions', function() {
      mock.callFactory.should.be.type('function')
      mock.returnService.should.be.type('function')
    })

    it('returnService should return true', function() {
      var rS = mock.returnService()
      rS.should.have.property('a', true);
      rS.should.have.property('b', 'pass');
    });

    it('callFactory should return an object', function() {
      var cF = mock.callFactory()
      cF.should.have.property('factory', 'pass');
    })
  });

  describe('Injector should inject controllers into a function', function(){
    var injected = injector.inject(function(mockController){
      return mockController
    })

    it('should work the same as standalone', function() {
      var cF = mock.callFactory()
      cF.should.have.property('factory', 'pass');

      var rS = mock.returnService()
      rS.should.have.property('a', true);
      rS.should.have.property('b', 'pass');
    })
  })
});

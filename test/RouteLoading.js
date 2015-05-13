/**
 * @file RouteLoading
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

var should = require('should');
var path = require('path')
var expressMock = require('./mocks/express_mock').setup();

var injector = require('magnum-di');
var loggerMock = require('./mocks/logger_mock');

injector.service('Logger', loggerMock)
injector.service('Router', {get: function(){}})
var routeLoader = require('../lib/Server/RouteLoader');


describe('RouteLoader should load the correct routes.', function(){

  var routes = path.join(__dirname, './mocks/routes')
  var app = routeLoader(routes, expressMock, injector)

  describe('should accept parameters and return an app object', function() {
    it('Should be an object', function() {
      app.should.be.an.Object
    })
    it('Should have a routes property.', function() {

      app.should.have.property('routes')
    })
    it('Should have loaded 1 route.', function() {
      app.routes.should.have.length(1)
    })
  });
});


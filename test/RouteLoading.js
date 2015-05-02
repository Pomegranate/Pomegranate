/**
 * @file RouteLoading
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

var should = require('should');
var path = require('path')
var expressMock = require('./mocks/express_mock').setup();
var loggerMock = require('./mocks/logger_mock');
var routeLoader = require('../lib/RouteLoader');


describe('RouteLoader should load the correct routes.', function(){

  var routes = path.join(__dirname, './mocks/routes')
  var app = routeLoader(routes, expressMock, loggerMock, null, null)

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


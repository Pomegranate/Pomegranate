/**
 * @file RouteLoading
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

var should = require('should');
var path = require('path');
var express = require('express');
var Router = express.Router;

var request = require('supertest');
var app = express();

var injector = require('magnum-di');
var loggerMock = require('./mocks/logger_mock');

injector.service('Logger', loggerMock)
injector.factory('Router', Router)
var routeLoader = require('../lib/Server/RouteLoader');


describe('RouteLoader should load routes as expected.', function(){

  var routes = path.join(__dirname, './mocks/routes')
  var testApp = routeLoader(routes, app, injector)

  it('should start the server and respond to requests.', function(done){
    request(testApp)
      .get('/')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.path.should.equal('/')
        done()
      });
  })

  describe('should mount routes correctly based on filepath.', function() {
    it('should respond to /test', function(done){
      request(testApp)
        .get('/test')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.path.should.equal('/test')
          done()
        });;
    });

    it('should respond to /test/internal', function(done){
      request(testApp)
        .get('/test/internal')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.path.should.equal('/test/internal')
          done()
        });
    })

    it('should respond to /test/external', function(done){
      request(testApp)
        .get('/test/external')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.path.should.equal('/test/external')
          done()
        });
    })

    it('should handle parameter routing to /test/external/:name/:test/param', function(done){
      request(testApp)
        .get('/test/external/name/test/param')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.path.should.equal('/test/external/name/test/param')
          done()
        });
    })
  });
});


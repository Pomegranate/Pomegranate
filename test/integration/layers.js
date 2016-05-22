/**
 * @file layers
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
var path = require('path');
var mockConsole = require('../mocks/helpers/mockConsole')
process.chdir(path.join(__dirname,'../mocks/layerTest'))

var tap = require('tap')
var pomegranate = require('../../index')

var setLayers = ['core', 'doot','data', 'controller', 'dependency', 'setup','pre_router', 'router', 'post_router', 'server']

var frameworkOptions = {
  applicationDirectory: './application',
  pluginDirectory: './plugins',
  pluginSettingsDirectory: './pluginSettings',
  additionalLayers: setLayers,
  logger: mockConsole,
  timeout: 2000,
  verbose: true,
  colors: true
}

tap.test('Startup', function(t){
  var pom = pomegranate(frameworkOptions)
  t.plan(5)
  pom.on('ready',function(){
    t.pass('Ready Handler called')
  })
  pom.on('load',function(){
    t.pass('Load Handler called')
  })
  pom.on('start',function(){
    t.pass('Start Handler called')
    setLayers.unshift('system')
    t.equal(pom.layers.length, 11 , 'Uses additional layers as set.');
    setImmediate(function() {
      pom.stop()
    })
  })
  pom.on('stop',function(){
    t.pass('Stop Handler called')
  })
  pom.on('error',function(err){
    //Never
    t.fail('Error handler called')
    console.log(err);
  })

  pom.start()
})
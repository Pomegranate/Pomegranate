/**
 * @file PluginLoading
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';

const tap = require('tap')
const Pomegranate = require('../../index')
const path = require('path')

process.chdir(path.join(__dirname,'../mocks/startupTest'))

var frameworkOptions = {
  applicationDirectory: './application',
  pluginDirectory: './plugins',
  pluginSettingsDirectory: './pluginSettings',
  logger: console,
  timeout: 2000,
  verbose: false,
  colors: true
}

tap.test('Startup', function(t){
  var pom = Pomegranate(frameworkOptions)
  t.plan(4)
  pom.on('ready',function(){
    t.pass('Ready Handler called')
  })
  pom.on('load',function(){
    t.pass('Load Handler called')
  })
  pom.on('start',function(){
    t.pass('Start Handler called')
  })
  pom.on('stop',function(){
    t.pass('Stop Handler called')
  })
  // pom.on('error',function(err){
  //   //Never
  //   t.fail('Error handler called')
  //   console.log(err);
  // })

  pom.start()
  // t.done()
})
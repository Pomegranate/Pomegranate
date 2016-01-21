/**
 * @file appTemplate
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate-testbed
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

module.exports = function(appName) {
  var EOL = require('os').EOL
  var file = [
    '/* ',
    ' * Pomegranate application ' + appName ,
    ' */',
    '',
    'var Pomegranate = require(\'pomegranate\');',
    'var FrameworkOptions = require(\'./FrameworkSettings\');',
    '',
    'var pom = Pomegranate(FrameworkOptions);',
    '',
    'pom.on(\'ready\', function(){',
    '  pom.start();',
    '});'
  ].join(EOL)
  return file
}


//var pomegranate = require('pomegranate-testbed');
//var app = pomegranate();
//
//var FrameworkOptions = {
//  timeout: 5000,
//  developmentMode: true,
//  logger: console,
//  colors: true,
//  verbose: true,
//  pluginDirectory: './plugins'
//}
//
//var pluginOptions = {
//  postgres: {
//    host: 'database.internal',
//    port: 5432,
//    username: 'trivnow',
//    password: 'trivnow',
//    database: 'trivnow_data',
//    models: __dirname + '/models'
//  },
//  express: {
//    routes: __dirname + '/routes',
//  },
//  Controllers: {
//    workDir: './controllers'
//  }
//}
//
//app
//  .init(FrameworkOptions, pluginOptions)
//
//setTimeout(function() {
//  app.start()
//}, 1000)
//
//setTimeout(function(){
//  app.stop()
//}, 60 * 60 * 10 * 1000)
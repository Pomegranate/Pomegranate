/**
 * @file report
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const path = require('path')
const _ = require('lodash')
const s2 = '  '
const s4 = '    '
/**
 *
 * @module report
 */

module.exports = function createPluginConfig(args) {
  var Config = require(path.join(process.cwd(), args.config));
  Config.verbose = false;
  var Pomegranate = require('../../')

  let pom = Pomegranate(Config, true)
  let report = pom.generateReport()
  let Loader = pom.getLoader()

  Loader.systemLog('info', 'Outputting Plugin Report....')

  if(args.write){
    Loader.systemLog('info', 'Oops. We havent implemented that yet, sorry.')
  } else {
    _.each(report, (plugin) => {

      basicInfo(plugin)

      options('Default options', plugin.options)
      options('Computed options', plugin.computedOptions)

      deps('Required dependencies', plugin.dependencies)
      deps('Optional dependencies', plugin.optional)
      deps('Providing dependencies', plugin.provides)

      console.log('  --  ');
    })
  }
}

function basicInfo(plugin) {
  console.log(plugin.moduleName);
  console.log(s2,'Type:',plugin.type);
  console.log(s2,'Prefix:' ,plugin.prefix);
  console.log(s2,'Config name:' ,plugin.configName);
  console.log(s2,'Param:' ,plugin.injectableParam);
  console.log(s2, 'Enabled:', plugin.enabled)
}

function defaultOptions(options) {
  console.log(s2, 'Default options:');

  if(_.keys(options) > 0){
    _.each(options, (val, key) => {
      console.log(s4, `${key}:`, val);
    })
  } else {
    console.log(s4, '- none');
  }
}

function computedOptions(compOptions){
  console.log(s2, 'Computed options:');
  _.each(compOptions, (val, key) => {
    console.log(s4, `${key}:`, val);
  })
}

function options(title, optionsObj){
  console.log(s2, `${title}:`);

  if(_.keys(optionsObj) > 0){
    _.each(optionsObj, (val, key) => {
      console.log(s4, `${key}:`, val);
    })
  } else {
    console.log(s4, '- none');
  }
}

function deps(title, depsObj) {
  console.log(s2, `${title}:`);
  if(depsObj.length > 0) {
    _.each(depsObj, (val) => {
      console.log(s4, '-',val);
    })
  } else {
    console.log(s4, '- none');
  }
}

/**
 * @file OptionHandler
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate-testbed
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';

var _ = require('lodash');
var path = require('path');

/**
 * Handles incoming options object formatting and validation.
 * @module OptionHandler
 */

exports.immutableOptions = {
  prefix: 'pomegranate'
};

exports.parseOptions = function(FrameworkOptions, ParentDirectory){

  try {
    var pluginDirPath = path.join(ParentDirectory, FrameworkOptions.pluginDirectory);
  }
  catch(e){
    console.log(e);
    process.exit()
  }
  try {
    var applicationDirPath = path.join(ParentDirectory, FrameworkOptions.applicationDirectory);
  }
  catch(e){
    if(e instanceof TypeError){
      console.log('No application directory set falling back to current working directory.')
    }
    applicationDirPath = false;
  }

  var mergedOptions = _.chain(FrameworkOptions)
    .omit('prefix')
    .merge({
      prefix: 'pomegranate'
    })
    .merge({
      parentDirectory: ParentDirectory,
      applicationDirectory: path.join(ParentDirectory, FrameworkOptions.applicationDirectory),
      pluginDirectory: path.join(ParentDirectory, FrameworkOptions.pluginDirectory),
      pluginSettingsDirectory: path.join(ParentDirectory, FrameworkOptions.pluginSettingsDirectory)
    })
    .value()
  return mergedOptions
}
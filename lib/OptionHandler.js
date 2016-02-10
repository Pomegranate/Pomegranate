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
  prefix: 'pomegranate',
  layers: ['core', 'data', 'controller', 'dependency', 'setup','pre_router', 'router', 'post_router', 'server']
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
    .omit('prefix', 'layers')
    .merge({
      prefix: 'pomegranate',
      layers: exports.validateLayers(FrameworkOptions)
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

exports.validateLayers = function(FrameworkOptions) {
  //filter the list of provided layers.
  if(_.isArray(FrameworkOptions.additionalLayers)){
    var additionalLayers = FrameworkOptions.additionalLayers;
    var original = _.clone(additionalLayers);
    var frameworkLayers = exports.immutableOptions.layers;
    var diff = _.difference(additionalLayers, frameworkLayers);
    var mutatedLayerOrder = _.pull.apply(_, [additionalLayers].concat(diff));

    if(_.isEqual(frameworkLayers, mutatedLayerOrder)){
      return original
    }
    throw new TypeError('options.additionalLayers must contain the default layer array in the correct order.')
  }
  return exports.immutableOptions.layers
}
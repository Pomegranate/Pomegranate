/**
 * @file LogMiddleware
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {CreatePlugin} from "@pomegranate/plugin-tools"


/**
 *
 * @module LoggingMiddleware
 */


export const Plugin = CreatePlugin('merge')
  .variables({
  })
  .configuration({
    name: 'LoggingMiddleware',
    injectableParam: 'LogMiddleware',
    frameworkPlugin: true
  })
  .hooks({
    load: (PluginLogger, PluginVariables, Whoa) => {
      return {name: 'LogMiddleware'}
    }

  })
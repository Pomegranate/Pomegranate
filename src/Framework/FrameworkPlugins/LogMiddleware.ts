/**
 * @file LogMiddleware
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {InjectablePlugin} from "@pomegranate/plugin-tools"


/**
 *
 * @module LoggingMiddleware
 */


export const Plugin = InjectablePlugin()
  .variables({
  })
  .configuration({
    name: 'LoggingMiddleware',
    type: 'merge',
    injectableParam: 'LogMiddleware',
    frameworkPlugin: true
  })
  .hooks({
    load: (PluginLogger, PluginVariables, Whoa) => {
      return {name: 'LogMiddleware'}
    }

  })
/**
 * @file AddUtilities
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {transform, toPairs} from 'lodash/fp'
import {PluginConfiguration} from "../Plugin";
import {CompositePlugin} from "@pomegranate/plugin-tools"
// @ts-ignore
const uncappedTransform = transform.convert({cap: false})

/**
 *
 * @module AddUtilities
 */

function hasType(item) {
  return ({}).toString.call(item).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

export const Plugin = CompositePlugin()
  .variables({
    Utilities: {
      HelloPomegranate: () => {
        // These can be Objects, Functions, Strings etc. that don' need any other Dependencies.
        console.log('Hello, I am a function that has been added to the injector.')
      }
    }
  })
  .configuration({
    name: 'AddUtilities',
    type: 'composite',
    frameworkPlugin: true
  })
  .hooks({
    load: (PluginLogger, PluginVariables, Whoa) => {
      let Utils = transform((acc, [injectableParam, value]) => {
        PluginLogger.log(`Found property '${injectableParam}' with type: ${hasType(value)}`)
        acc.push({value, injectableParam})
      }, [])(toPairs(PluginVariables.Utilities))

      return Utils
    }

  })

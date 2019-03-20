/**
 * @file InjectablePlugin
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {ProvidesAction} from "./ProvideTypes";

export const variables = {}
export const directories = []
export const configuration = {
  name: 'InjectablePlugin',
  type: "instance",
  injectableParam: 'Injecting',
  depends: []
}
export const hooks = {
  load: () => {

  }

}

export const commands = {}
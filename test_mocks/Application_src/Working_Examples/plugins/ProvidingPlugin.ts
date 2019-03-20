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
  name: 'ProvidingPlugin',
  type: "instance",
  injectableParam: 'Providing',
  provides: ['DependingPlugin']
}
export const hooks = {
  load: (pa: ProvidesAction) => {
  }

}

export const commands = {}
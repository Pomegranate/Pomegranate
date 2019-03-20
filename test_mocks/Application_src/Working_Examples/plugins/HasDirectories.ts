/**
 * @file InjectablePlugin
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {ProvidesAction} from "./ProvideTypes";

export const variables = {}
export const directories = [
  'things',
  'some/path'
]
export const configuration = {
  name: 'HasDirectories',
  type: "instance",
  injectableParam: 'HasDirs',
  depends: []
}
export const hooks = {
  load: (pa: ProvidesAction) => {
  }

}

export const commands = {}
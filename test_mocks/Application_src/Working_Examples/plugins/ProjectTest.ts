/**
 * @file ActionTest
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {ProvidesAction} from "./ProvideTypes";

export const variables = {}
export const directories = []
export const configuration = {
  name: 'InstancePlugin',
  type: "action"
}
export const hooks = {
  load: (pa: ProvidesAction) => {
    //you will have full type/IDE support here
  }

}

export const commands = {}
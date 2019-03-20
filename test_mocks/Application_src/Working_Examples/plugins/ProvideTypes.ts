/**
 * @file ActionTest
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

export interface ProvidesAction {
  setName: (name: string) => string
}

export const variables = {}
export const directories = []
export const configuration = {
  name: 'ProvideTypes',
  type: "action",
}
export const hooks = {
    load: () => {
  }
}

export const commands = {}
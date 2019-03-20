/**
 * @file ActionTest
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import {PomegranatePlugin} from "../../../../../src/Framework/Plugin";

// export const ActionTest: PomegranatePlugin = {
//   variables: {},
//   directories: [],
//   configuration: {
//     name: 'ActionTest',
//     type: "action",
//
//   },
//   hooks: {
//     load() {
//     },
//   },
//   commands: {}
//
// }

export const variables = {}
export const directories = []
export const configuration = {
  name: 'DirectoryTest',
  type: "action",
}
export const hooks = {
    load() {
  }
}

export const commands = {}
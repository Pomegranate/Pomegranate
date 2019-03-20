/**
 * @file InjectablePlugin
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {ProvidesAction} from "./ProvideTypes";
import {PomegranateLogger} from "../../../../Framework/FrameworkLogger";

export const variables = {}
export const directories = []
export const configuration = {
  name: 'DependingPlugin',
  type: "instance",
  injectableParam: 'Depending',
  depends: ['InjectablePlugin']
}
export const hooks = {
  load: (Logger: PomegranateLogger) => {
  }

}

export const commands = {}
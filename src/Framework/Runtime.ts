/**
 * @file Runtime
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {Pomegranate} from './Pomegranate'
import {PomegranateConfiguration} from "./Configuration";

export async function PomegranateRuntime(workingDirectory: string, settings: PomegranateConfiguration){
  let Pom = await Pomegranate(workingDirectory,settings)
  return Pom
}
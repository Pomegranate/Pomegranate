/**
 * @file Runtime
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import { PomegranateConfiguration } from "./Configuration";
export declare function PomegranateRuntime(workingDirectory: string, settings: PomegranateConfiguration): Promise<import("./Pomegranate").PomegranateRuntime>;

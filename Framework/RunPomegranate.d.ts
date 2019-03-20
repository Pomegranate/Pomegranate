/**
 * @file Runner
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import { PomegranateConfiguration } from "./Configuration";
export declare const RunPomegranate: (settings: PomegranateConfiguration, workingDirectory?: string) => Promise<{
    start: () => Promise<void>;
    stop: () => Promise<void>;
}>;

/**
 * @file Timers
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import { PomegranateLogger } from "../FrameworkLogger";
import Bluebird from 'bluebird';
export declare function PluginTimer(pluginLogger: PomegranateLogger, initialTimeout: number): {
    safePostponeDuration: number;
    start: () => any;
    postponeTimeout: () => void;
    reset: () => void;
    promise: () => Bluebird<{}>;
};

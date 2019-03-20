/**
 * @file Configure
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import { ValidatedConfiguration, PomegranateConfiguration } from "../Configuration";
export declare function Configure(frameworkMetrics: any, baseDirectory: string, config: PomegranateConfiguration): Promise<{
    PomConfig: any;
    FrameworkConfiguration: import("../Common/FutureState").IFutureState<ValidatedConfiguration>;
    loggerFactory: import("monet").Reader<import("../FrameworkLogger").LoggerConf, import("../FrameworkLogger").PomegranateLogger>;
    LogManager: import("../FrameworkLogger/LogManager").LogManager;
    frameworkLogger: import("../FrameworkLogger").PomegranateLogger;
    systemLogger: import("../FrameworkLogger").PomegranateLogger;
}>;

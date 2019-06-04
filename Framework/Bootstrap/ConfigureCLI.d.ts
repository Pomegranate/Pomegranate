/**
 * @file ConfigureCLI
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import { PomegranateConfiguration } from "../Configuration";
export declare function ConfigureCLI(frameworkMetrics: any, baseDirectory: string, config: PomegranateConfiguration): Promise<{
    PomConfig: any;
    FrameworkConfiguration: import("../Validation").ValidatedTransformer;
    loggerFactory: import("monet").Reader<import("../FrameworkLogger").LoggerConf, import("../FrameworkLogger").PomegranateLogger>;
    LogManager: import("../FrameworkLogger/LogManager").LogManager;
    frameworkLogger: import("../FrameworkLogger").PomegranateLogger;
    systemLogger: import("../FrameworkLogger").PomegranateLogger;
}>;

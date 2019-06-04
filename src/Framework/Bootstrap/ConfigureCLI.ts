/**
 * @file ConfigureCLI
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {each} from 'lodash/fp'
import {ValidatedConfiguration, PomegranateConfig, PomegranateConfiguration} from "../Configuration";
import {FutureState} from "../Common/FutureState";
import {rightBar} from "../Common/frameworkOutputs";
import {createLoggerFactory} from "../FrameworkLogger";
import {reportEarlyErrors} from "../Common/ErrorReporters";
import {PomLogManager} from "../FrameworkLogger/LogManager";
import {CreateFrameworkLogHandler} from "../FrameworkLogger/FrameworkLogHandler";

import {transformFrameworkConfig, frameworkConfigValid} from "../Validation";

export async function ConfigureCLI(frameworkMetrics, baseDirectory: string, config: PomegranateConfiguration) {

  let transformConfig = transformFrameworkConfig(baseDirectory)

  try {
    frameworkMetrics.startFrameworkPhase('FrameworkConfig')
    let FrameworkConfiguration = await transformConfig(config)
    if(!FrameworkConfiguration.isValid()){

    }

    let PomConfig = await PomegranateConfig(baseDirectory, config)

    PomConfig.FrameworkMetrics = frameworkMetrics

    // let FrameworkConfiguration = FutureState<ValidatedConfiguration>(PomConfig)
    let loggerFactory = createLoggerFactory(PomConfig)
    // let frameworkLogger = loggerFactory.run({appendString: 'Pomegranate:', colors: {log: 'magenta'}})

    let LogManager = PomLogManager({logLevel: PomConfig.logLevel})
    LogManager.addHandler(CreateFrameworkLogHandler(PomConfig))
    let frameworkLogger = LogManager.createLogger({source:"pomegranate", logFormat: {log:['magenta']}})
    let systemLogger = LogManager.createLogger({appendSource: false, source:'system', logFormat: {log:['bold','cyanBright']}})

    rightBar(LogManager.use("system")).run({msg: 'Configuring framework resources'})
    LogManager.use('pomegranate').log(`Framework Configuration took ${frameworkMetrics.stopFrameworkPhase('FrameworkConfig')}ms.`, 3)
    return {PomConfig, FrameworkConfiguration, loggerFactory, LogManager, frameworkLogger, systemLogger}
  } catch (e) {
    reportEarlyErrors(e, config.logger)
    throw new Error('Pomegranate Startup failed before custom loggers could be created.')
  }
}
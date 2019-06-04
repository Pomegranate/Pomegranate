"use strict";
/**
 * @file ConfigureCLI
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Configuration_1 = require("../Configuration");
const frameworkOutputs_1 = require("../Common/frameworkOutputs");
const FrameworkLogger_1 = require("../FrameworkLogger");
const ErrorReporters_1 = require("../Common/ErrorReporters");
const LogManager_1 = require("../FrameworkLogger/LogManager");
const FrameworkLogHandler_1 = require("../FrameworkLogger/FrameworkLogHandler");
const Validation_1 = require("../Validation");
function ConfigureCLI(frameworkMetrics, baseDirectory, config) {
    return __awaiter(this, void 0, void 0, function* () {
        let transformConfig = Validation_1.transformFrameworkConfig(baseDirectory);
        try {
            frameworkMetrics.startFrameworkPhase('FrameworkConfig');
            let FrameworkConfiguration = yield transformConfig(config);
            if (!FrameworkConfiguration.isValid()) {
            }
            let PomConfig = yield Configuration_1.PomegranateConfig(baseDirectory, config);
            PomConfig.FrameworkMetrics = frameworkMetrics;
            // let FrameworkConfiguration = FutureState<ValidatedConfiguration>(PomConfig)
            let loggerFactory = FrameworkLogger_1.createLoggerFactory(PomConfig);
            // let frameworkLogger = loggerFactory.run({appendString: 'Pomegranate:', colors: {log: 'magenta'}})
            let LogManager = LogManager_1.PomLogManager({ logLevel: PomConfig.logLevel });
            LogManager.addHandler(FrameworkLogHandler_1.CreateFrameworkLogHandler(PomConfig));
            let frameworkLogger = LogManager.createLogger({ source: "pomegranate", logFormat: { log: ['magenta'] } });
            let systemLogger = LogManager.createLogger({ appendSource: false, source: 'system', logFormat: { log: ['bold', 'cyanBright'] } });
            frameworkOutputs_1.rightBar(LogManager.use("system")).run({ msg: 'Configuring framework resources' });
            LogManager.use('pomegranate').log(`Framework Configuration took ${frameworkMetrics.stopFrameworkPhase('FrameworkConfig')}ms.`, 3);
            return { PomConfig, FrameworkConfiguration, loggerFactory, LogManager, frameworkLogger, systemLogger };
        }
        catch (e) {
            ErrorReporters_1.reportEarlyErrors(e, config.logger);
            throw new Error('Pomegranate Startup failed before custom loggers could be created.');
        }
    });
}
exports.ConfigureCLI = ConfigureCLI;
//# sourceMappingURL=ConfigureCLI.js.map
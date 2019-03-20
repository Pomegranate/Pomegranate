"use strict";
/**
 * @file LogManager
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = require("lodash/fp");
const fp_2 = require("lodash/fp");
function getVerbArgs(args) {
    if (fp_1.isNumber(fp_1.last(args))) {
        // Remove the last argument from the array, so we have the correct array for logging later.
        let rv = args.splice(-1, 1)[0];
        return [rv, args];
    }
    // Default to logLevel 1
    return [1, args];
}
exports.DataLogger = (metadata, processor) => {
    return {
        metadata: metadata,
        log: (...args) => {
            let [verbocity, messages] = getVerbArgs(args);
            processor({ severity: 'log', verbocity, messages }, metadata);
        },
        warn: (...args) => {
            let [verbocity, messages] = getVerbArgs(args);
            processor({ severity: 'warn', verbocity, messages }, metadata);
        },
        info: (...args) => {
            let [verbocity, messages] = getVerbArgs(args);
            processor({ severity: 'info', verbocity, messages }, metadata);
        },
        error: (...args) => {
            let [verbocity, messages] = getVerbArgs(args);
            processor({ severity: 'error', verbocity, messages }, metadata);
        }
    };
};
exports.PomLogManager = (config) => {
    let conf = fp_2.defaults({ logLevel: 1, logFormat: { log: ['green'], warn: ['yellow'], info: ['cyan'], error: ['red'] } }, config);
    let handlers = [];
    let loggers = {};
    // const process = (source, severity, verbocity, formatting, messages) => {
    const process = (logMessage, loggerData) => {
        fp_1.each((handle) => {
            let clonedMessage = fp_1.cloneDeep(logMessage);
            let clonedData = fp_1.cloneDeep(loggerData);
            handle(clonedMessage, clonedData);
        }, handlers);
    };
    return {
        process: process,
        createLogger: (loggerData) => {
            if (!fp_1.isString(fp_1.get('source', loggerData))) {
                throw new Error('Cannot create Logger without at minimum a "source" property.');
            }
            let defMeta = fp_1.defaultsDeep({ appendSource: true, logLevel: conf.logLevel, logFormat: conf.logFormat }, loggerData);
            let dl = exports.DataLogger(defMeta, process);
            loggers[defMeta.source] = dl;
            return dl;
        },
        addHandler: (handler) => {
            if (fp_1.isFunction(handler)) {
                handlers.push(handler);
                return;
            }
            throw new Error('Log handler must be a function.');
        },
        use: (source) => {
            return loggers[source];
        }
    };
};
//# sourceMappingURL=LogManager.js.map
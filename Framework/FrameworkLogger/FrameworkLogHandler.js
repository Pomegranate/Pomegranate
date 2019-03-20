"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
exports.CreateFrameworkLogHandler = (PomConfig) => {
    let doLog = index_1.LogWrapper(PomConfig.logger, PomConfig.logLevel, PomConfig.colorOutput);
    return (logMessgage, loggerData) => {
        doLog(logMessgage, loggerData);
    };
};
//# sourceMappingURL=FrameworkLogHandler.js.map
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const RequirePlugins_1 = require("../RequirePlugins");
const frameworkOutputs_1 = require("../Common/frameworkOutputs");
function LoadPlugins(PomConfig, LogManager) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            frameworkOutputs_1.rightBar(LogManager.use('system')).run({ msg: 'Discovering plugin modules.' });
            PomConfig.FrameworkMetrics.startFrameworkPhase('LoadPlugins');
            let loaded = yield RequirePlugins_1.RequirePlugins(PomConfig, LogManager);
            LogManager.use('pomegranate').log(`Plugin module loading took ${PomConfig.FrameworkMetrics.stopFrameworkPhase('LoadPlugins')}ms.`, 3);
            return loaded;
        }
        catch (e) {
            LogManager.use('pomegranate').error('Plugin Module loading failed.');
            LogManager.use('pomegranate').error(e, 0);
            throw new Error('Pomegranate Startup failed.');
        }
    });
}
exports.LoadPlugins = LoadPlugins;
//# sourceMappingURL=LoadPlugins.js.map
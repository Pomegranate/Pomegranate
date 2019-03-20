"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Defer_1 = require("../Common/Defer");
const NS_PER_SEC = 1e9;
function PluginTimer(pluginLogger, initialTimeout) {
    let deferred = Defer_1.Defer();
    let timer = null;
    let clear = () => {
        clearTimeout(timer);
        timer = null;
    };
    return {
        safePostponeDuration: initialTimeout * 0.75,
        start: function () {
            pluginLogger.log('Starting Hook Timeout.', 4);
            timer = setTimeout(() => {
                deferred.reject(new Error('Plugin timeout expired'));
            }, initialTimeout);
            return this.promise();
        },
        postponeTimeout: function () {
            pluginLogger.warn('Attempting to postpone hook timeout. Use this feature with great caution as it can deadlock the process.');
            clear();
            this.start();
        },
        reset: function () {
            pluginLogger.log('Reset hook timeout.', 4);
            clear();
            deferred = Defer_1.Defer();
        },
        promise: function () {
            return deferred.promise;
        }
    };
}
exports.PluginTimer = PluginTimer;
//# sourceMappingURL=Timers.js.map
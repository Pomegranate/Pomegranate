"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file Timings
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
const fp_1 = require("lodash/fp");
const NS_PER_SEC = 1e9;
function toMillis(comparator) {
    let hr = process.hrtime(comparator);
    let time = (hr[0] * NS_PER_SEC + hr[1]) / 1000000;
    return `${time.toFixed(2)}ms`;
}
function pluginTimings() {
    let timings = {
        initialize: {
            start: null,
            elapsedMs: null
        },
        validate: {
            start: null,
            elapsedMs: null
        },
        populate: {
            start: null,
            elapsedMs: null
        },
        load: {
            start: null,
            elapsedMs: null
        },
        start: {
            start: null,
            elapsedMs: null
        },
        stop: {
            start: null,
            elapsedMs: null
        }
    };
    return {
        startFrameworkPhase: (hook) => {
            timings[hook] = { start: process.hrtime() };
        },
        stopFrameworkPhase: (hook) => {
            let endMs = timings[hook].elapsedMs = toMillis(timings[hook].start);
            return endMs;
        },
        getHookDuration: (hook) => {
            return fp_1.getOr(null, `${hook}.elapsedMs`, timings);
        },
        getDurations: () => {
            fp_1.reduce((acc, [key, value]) => {
                return fp_1.set(key, value, acc);
            }, {}, fp_1.toPairs(timings));
        }
    };
}
exports.pluginTimings = pluginTimings;
//# sourceMappingURL=Timings.js.map
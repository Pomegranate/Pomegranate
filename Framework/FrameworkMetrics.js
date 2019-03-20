"use strict";
/**
 * @file FrameworkMetrics
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = require("lodash/fp");
const NS_PER_SEC = 1e9;
function toMillis([seconds, nanos]) {
    // let hr = process.hrtime(comparator);
    let time = (seconds * NS_PER_SEC + nanos) / 1000000;
    return Math.round(time * 1e3) / 1e3;
}
class PhaseMarker {
    constructor() {
    }
    markStart() {
        return this.start = process.hrtime();
    }
    markEnd() {
        if (!this.start) {
            throw new Error('markStart must be called before markEnd');
        }
        this.elapsed = process.hrtime(this.start);
        this.elapsedMs = toMillis(this.elapsed);
        return this.elapsedMs;
    }
}
exports.PhaseMarker = PhaseMarker;
function FrameworkMetrics() {
    let PluginMetrics = {};
    let RuntimeMetrics = {};
    return {
        startFrameworkPhase: (phase) => {
            let p = new PhaseMarker();
            RuntimeMetrics = fp_1.set(phase, p, RuntimeMetrics);
            return p.markStart();
        },
        stopFrameworkPhase: (phase) => {
            let obj = fp_1.getOr({}, phase, RuntimeMetrics);
            if (!fp_1.isFunction(obj.markEnd)) {
                throw new Error(`Object path "${phase}" does not exist.`);
            }
            return obj.markEnd();
        },
        startPluginPhase: (plugin, phase) => {
            let p = new PhaseMarker();
            PluginMetrics = fp_1.set(`${plugin}.${phase}`, p, PluginMetrics);
            return p.markStart();
        },
        stopPluginPhase: (plugin, phase) => {
            let obj = fp_1.getOr({}, `${plugin}.${phase}`, PluginMetrics);
            if (!fp_1.isFunction(obj.markEnd)) {
                throw new Error(`Object path "${plugin}.${phase}" does not exist.`);
            }
            return obj.markEnd();
        },
        getMetrics: () => {
            return {
                framework: RuntimeMetrics,
                plugins: PluginMetrics
            };
        }
    };
}
exports.FrameworkMetrics = FrameworkMetrics;
//# sourceMappingURL=FrameworkMetrics.js.map
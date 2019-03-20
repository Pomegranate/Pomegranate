/**
 * @file FrameworkMetrics
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
export declare class PhaseMarker {
    private start;
    private elapsed;
    private elapsedMs;
    constructor();
    markStart(): [number, number];
    markEnd(): any;
}
export interface Metrics {
    startFrameworkPhase: (phase: string) => [number, number];
    stopFrameworkPhase: (phase: string) => number;
    startPluginPhase: (plugin: string, phase: string) => [number, number];
    stopPluginPhase: (plugin: string, phase: string) => number;
    getMetrics: () => {
        framework: any;
        plugins: any;
    };
}
export declare function FrameworkMetrics(): Metrics;

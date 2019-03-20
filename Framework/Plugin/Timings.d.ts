export declare function pluginTimings(): {
    startFrameworkPhase: (hook: string) => void;
    stopFrameworkPhase: (hook: string) => string;
    getHookDuration: (hook: any) => import("lodash/fp").LodashGetOr4x6;
    getDurations: () => void;
};

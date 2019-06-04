/// <reference types="node" />
import { EventEmitter } from 'events';
import { PomegranateConfiguration } from "./Configuration";
export interface PomegranateRuntime {
    events: EventEmitter;
    externalLog: (method: any, msg: any) => any;
    load: () => any;
    start: () => any;
    stop: () => any;
}
export declare function RunCLI(baseDirectory: string, config: PomegranateConfiguration): Promise<{
    Plugins: any;
    Config: any;
    FrameworkConfiguration: import("./Validation").ValidatedTransformer;
}>;
export declare function Pomegranate(baseDirectory: string, config: PomegranateConfiguration): Promise<PomegranateRuntime>;

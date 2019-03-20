/// <reference types="node" />
import { EventEmitter } from 'events';
import { PomegranateConfiguration } from "./Configuration";
import { ComposedPlugin } from "./Plugin";
export interface PomegranateRuntime {
    events: EventEmitter;
    externalLog: (method: any, msg: any) => any;
    load: () => any;
    start: () => any;
    stop: () => any;
}
export declare function CliData(baseDirectory: string, config: PomegranateConfiguration): Promise<{
    Plugins: ComposedPlugin[];
    Config: import("./Configuration").ComposedFrameworkState;
}>;
export declare function Pomegranate(baseDirectory: string, config: PomegranateConfiguration): Promise<PomegranateRuntime>;

/**
 * @file PluginTypes
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project PluginTools
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
export declare type InjectableParameter = any;
export declare type InjectableScope = 'global' | 'namespace' | 'application';
export interface PomegranatePluginConfig {
    name: string;
    type: string;
    injectableParam?: string;
    injectableScope?: InjectableScope;
    frameworkPlugin?: boolean;
    depends?: string[];
    provides?: string[];
    optional?: string[];
}
export interface PomegranatePlugin {
    configuration: PomegranatePluginConfig;
    directories?: PluginDirectories;
    variables?: PluginVariables;
    hooks?: CommonHooks;
    commands?: PluginCommands;
    applicationPlugins?: CommonBuilder[];
    installs?: any;
    overrides?: any;
}
export interface GeneratedPlugin {
    builder: string;
    state: any;
}
export interface CommonConfiguration<TPluginType> {
    name: string;
    type: TPluginType;
    frameworkPlugin?: boolean;
    applicationMember?: string[];
}
export interface CommonBuilder {
    getPlugin: () => GeneratedPlugin;
}
export interface PluginDirectory {
    prop: string;
    path: string;
}
export interface PluginDirectories {
    [index: number]: string | PluginDirectory;
}
export declare function isPluginDirectory(pluginDirectory: string | PluginDirectory): pluginDirectory is PluginDirectory;
export interface LogMessage {
    severity: string;
    verbocity: number;
    messages: any[];
}
export declare type PomLogger = 'pomegranate';
export declare type SystemLogger = 'system';
export interface LoggerData {
    source: PomLogger | SystemLogger | string;
    appendSource?: boolean;
    logLevel?: number;
    logFormat?: {
        log?: string[];
        warn?: string[];
        info?: string[];
        error?: string[];
    };
}
export interface CommonHooks {
    load?(...injectable: InjectableParameter[]): Promise<any> | any;
    start?(...injectable: InjectableParameter[]): Promise<any> | any;
    stop?(...injectable: InjectableParameter[]): Promise<any> | any;
}
export interface InjectableHooks<T> extends CommonHooks {
    load(...injectable: InjectableParameter[]): Promise<T> | T;
}
export interface LogHandler {
    (logMessage: LogMessage, loggerData: LoggerData): void;
}
export interface PluginVariables {
    [key: string]: any;
}
export interface PluginCommands {
    (...injectable: InjectableParameter[]): any;
}

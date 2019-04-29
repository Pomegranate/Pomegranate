/**
 * @file LoghandlerPlugin
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project PluginTools
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import { CommonConfiguration, PluginDirectories, PluginCommands, PluginVariables, PomegranatePlugin, CommonHooks, InjectableParameter, LogHandler } from "../PluginTypes";
import { Builder } from "./Builder";
export declare type LoghandlerB = 'LoghandlerBuilder';
export declare type LoghandlerPluginTypes = 'loghandler';
export interface LoghandlerConfiguration extends CommonConfiguration<LoghandlerPluginTypes> {
    depends?: string[];
    provides?: string[];
    optional?: string[];
    frameworkPlugin?: boolean;
}
export interface FluentLoghandlerConfig {
    name: string;
    frameworkPlugin?: any;
    depends?: string[];
    provides?: string[];
    optional?: string[];
}
export interface LoghandlerHooks extends CommonHooks {
    load(...injectable: InjectableParameter[]): Promise<LogHandler> | LogHandler;
}
export interface PomLogHandlerPlugin extends PomegranatePlugin {
    configuration: LoghandlerConfiguration;
    hooks: LoghandlerHooks;
    directories?: PluginDirectories;
    variables?: PluginVariables;
    commands?: PluginCommands;
    installs?: any;
    dashboard?: any;
}
export declare class LoghandlerBuilder extends Builder {
    builder: LoghandlerB;
    constructor(state: LoghandlerPluginTypes | PomLogHandlerPlugin);
    configuration(configuration: FluentLoghandlerConfig): this;
    hooks(hooks: LoghandlerHooks): this;
    variables(variables: PluginVariables): this;
    directories(directories: PluginDirectories): this;
    commands(commands: PluginCommands): this;
    installs(installs: any): this;
    dashboard(dashboard: any): this;
}

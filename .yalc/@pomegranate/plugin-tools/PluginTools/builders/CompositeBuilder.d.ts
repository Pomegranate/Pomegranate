/**
 * @file InjectablePlugin
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project PluginTools
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import { CommonConfiguration, PluginDirectories, PluginCommands, PluginVariables, PomegranatePlugin, CommonHooks, InjectableParameter, InjectableScope, InjectableHooks } from "../PluginTypes";
import { ActionPluginTypes } from "./ActionBuilder";
import { InjectablePluginTypes } from "./InjectableBuilder";
import { LoghandlerPluginTypes } from "./LoghandlerBuilder";
import { Builder } from "./Builder";
export declare type CompositeB = 'CompositeBuilder';
export declare type CompositePluginTypes = 'composite';
export interface CompositeConfiguration extends CommonConfiguration<CompositePluginTypes> {
    depends?: string[];
    provides?: string[];
    optional?: string[];
    frameworkPlugin?: boolean;
}
export interface FluentCompositeConfig {
    name: string;
    frameworkPlugin?: any;
    injectableScope?: string;
    applicationMember?: string[];
    depends?: string[];
    provides?: string[];
    optional?: string[];
}
export declare type ComposedPluginTypes = ActionPluginTypes | InjectablePluginTypes | LoghandlerPluginTypes | CompositePluginTypes;
export interface compositeValue {
    injectableParam: string;
    injectableScope?: InjectableScope;
    load: any;
    type?: ComposedPluginTypes;
}
export interface CompositeHooks extends CommonHooks {
    load(...injectable: InjectableParameter[]): Promise<compositeValue[]> | compositeValue[];
}
export interface PomCompositePlugin extends PomegranatePlugin {
    configuration: CompositeConfiguration;
    hooks: CompositeHooks;
    directories?: PluginDirectories;
    variables?: PluginVariables;
    commands?: PluginCommands;
    installs?: any;
    dashboard?: any;
}
export declare class CompositeBuilder extends Builder {
    builder: CompositeB;
    constructor(state: CompositePluginTypes | PomCompositePlugin);
    configuration(configuration: FluentCompositeConfig): this;
    hooks<TInjectable>(hooks: InjectableHooks<TInjectable>): this;
    variables(variables: PluginVariables): this;
    directories(directories: PluginDirectories): this;
    commands(commands: PluginCommands): this;
    installs(installs: any): this;
    dashboard(dashboard: any): this;
}

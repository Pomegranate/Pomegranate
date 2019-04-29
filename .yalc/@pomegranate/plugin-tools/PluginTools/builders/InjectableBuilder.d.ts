/**
 * @file InjectablePlugin
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project PluginTools
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import { CommonConfiguration, InjectableHooks, InjectableScope, PluginCommands, PluginDirectories, PluginVariables, PomegranatePlugin } from "../PluginTypes";
import { Builder } from "./Builder";
export declare type InjectableB = 'InjectableBuilder';
export declare type InjectablePluginTypes = 'anything' | 'factory' | 'instance' | 'merge';
export interface InjectableConfiguration extends CommonConfiguration<InjectablePluginTypes> {
    injectableParam: string;
    injectableScope?: InjectableScope;
    depends?: string[];
    provides?: string[];
    optional?: string[];
    frameworkPlugin?: boolean;
}
export interface FluentInjectableConfig {
    name: string;
    frameworkPlugin?: any;
    injectableParam: string;
    injectableScope?: string;
    applicationMember?: string[];
    depends?: string[];
    provides?: string[];
    optional?: string[];
}
export interface PomInjectablePlugin<TInjectable = any> extends PomegranatePlugin {
    configuration: InjectableConfiguration;
    hooks: InjectableHooks<TInjectable>;
    directories?: PluginDirectories;
    variables?: PluginVariables;
    commands?: PluginCommands;
    installs?: any;
    dashboard?: any;
}
export declare class InjectableBuilder extends Builder {
    builder: InjectableB;
    constructor(state: InjectablePluginTypes | PomInjectablePlugin);
    configuration(configuration: FluentInjectableConfig): this;
    hooks<TInjectable>(hooks: InjectableHooks<TInjectable>): this;
    variables(variables: PluginVariables): this;
    directories(directories: PluginDirectories): this;
    commands(commands: PluginCommands): this;
    installs(installs: any): this;
    dashboard(dashboard: any): this;
}

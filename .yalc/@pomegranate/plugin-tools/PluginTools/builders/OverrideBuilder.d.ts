/**
 * @file InjectablePlugin
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project PluginTools
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import { CommonConfiguration, PluginDirectories, PluginCommands, PluginVariables, PomegranatePlugin, InjectableHooks } from "../PluginTypes";
import { Builder } from "./Builder";
export declare type OverrideB = 'OverrideBuilder';
export declare type OverridePluginTypes = 'override';
export interface OverrideConfiguration extends CommonConfiguration<OverridePluginTypes> {
    depends?: string[];
    provides?: string[];
    optional?: string[];
    frameworkPlugin?: boolean;
}
export interface FluentOverrideConfig {
    name: string;
    frameworkPlugin?: any;
    applicationMember?: string[];
    depends?: string[];
    provides?: string[];
    optional?: string[];
}
export interface PomOverridePlugin<TInjectable = any> extends PomegranatePlugin {
    configuration: OverrideConfiguration;
    hooks: InjectableHooks<TInjectable>;
    directories?: PluginDirectories;
    variables?: PluginVariables;
    commands?: PluginCommands;
    overrides: string;
    installs?: any;
    dashboard?: any;
}
export declare class OverrideBuilder extends Builder {
    builder: OverrideB;
    constructor(state: OverridePluginTypes | PomOverridePlugin);
    configuration(configuration: FluentOverrideConfig): this;
    hooks<TInjectable>(hooks: InjectableHooks<TInjectable>): this;
    overrides(overrides: any): this;
    variables(variables: PluginVariables): this;
    directories(directories: PluginDirectories): this;
    commands(commands: PluginCommands): this;
    installs(installs: any): this;
    dashboard(dashboard: any): this;
}

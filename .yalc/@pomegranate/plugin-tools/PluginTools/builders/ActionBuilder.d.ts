/**
 * @file InjectablePlugin
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project PluginTools
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import { CommonConfiguration, PluginDirectories, PluginCommands, PluginVariables, PomegranatePlugin, CommonHooks } from "../PluginTypes";
import { Builder } from "./Builder";
export declare type ActionB = 'ActionBuilder';
export declare type ActionPluginTypes = 'action';
export interface ActionConfiguration extends CommonConfiguration<ActionPluginTypes> {
    depends?: string[];
    provides?: string[];
    optional?: string[];
    frameworkPlugin?: boolean;
}
export interface ActionHooks extends CommonHooks {
}
export interface PomActionPlugin extends PomegranatePlugin {
    configuration: ActionConfiguration;
    hooks: ActionHooks;
    directories?: PluginDirectories;
    variables?: PluginVariables;
    commands?: PluginCommands;
    installs?: any;
    dashboard?: any;
}
export interface FluentActionConfig {
    name: string;
    frameworkPlugin?: any;
    applicationMember?: string[];
    depends?: string[];
    provides?: string[];
    optional?: string[];
}
export declare class ActionBuilder extends Builder {
    builder: ActionB;
    constructor(state: ActionPluginTypes | PomActionPlugin);
    configuration(configuration: FluentActionConfig): this;
    hooks(hooks: ActionHooks): this;
    variables(variables: PluginVariables): this;
    directories(directories: PluginDirectories): this;
    commands(commands: PluginCommands): this;
    installs(installs: any): this;
    dashboard(dashboard: any): this;
}

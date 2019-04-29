/**
 * @file InjectablePlugin
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project PluginTools
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import { CommonConfiguration, PluginDirectories, PluginCommands, PluginVariables, PomegranatePlugin } from "../PluginTypes";
import { Builder } from "./Builder";
export declare type CommandB = 'CommandBuilder';
export declare type CommandPluginTypes = 'command';
export interface CommandConfiguration extends CommonConfiguration<CommandPluginTypes> {
}
export interface FluentCommandConfig {
    name: string;
    frameworkPlugin?: boolean;
}
export interface PomCommandPlugin extends PomegranatePlugin {
    configuration: CommandConfiguration;
    directories?: PluginDirectories;
    variables?: PluginVariables;
    commands?: PluginCommands;
    installs?: any;
    dashboard?: any;
}
export declare class CommandBuilder extends Builder {
    builder: CommandB;
    constructor(state: CommandPluginTypes | PomCommandPlugin);
    configuration(configuration: FluentCommandConfig): this;
    variables(variables: PluginVariables): this;
    directories(directories: PluginDirectories): this;
    commands(commands: PluginCommands): this;
    installs(installs: any): this;
    dashboard(dashboard: any): this;
}

import { Builder } from './Builder';
import { CommonBuilder, CommonConfiguration, PomegranatePlugin } from "../PluginTypes";
export declare type ApplicationB = 'ApplicationBuilder';
export declare type ApplicationPluginTypes = 'application';
export interface ApplicationConfiguration extends CommonConfiguration<ApplicationPluginTypes> {
}
export interface FluentApplicationConfig {
    name: string;
}
export interface PomApplicationPlugin extends PomegranatePlugin {
    configuration: ApplicationConfiguration;
    applicationPlugins: CommonBuilder[];
}
export declare class ApplicationBuilder extends Builder {
    builder: ApplicationB;
    constructor(state: ApplicationPluginTypes | PomApplicationPlugin);
    configuration(configuration: FluentApplicationConfig): this;
    applicationPlugins(applicationPlugins: CommonBuilder[]): this;
}

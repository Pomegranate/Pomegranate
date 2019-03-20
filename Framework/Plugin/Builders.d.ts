export interface PluginConfiguration {
    name: string;
    type: string;
    frameworkPlugin?: boolean;
    injectableParam?: string;
    depends?: string[];
    provides?: string[];
    optional?: string[];
}
export interface PluginDirectories {
    [index: number]: string | {
        prop: string;
        path: string;
    };
}
export interface PluginHooks<T> {
    load: (...args: any[]) => T | Promise<T>;
    start?: (...args: any[]) => any;
    stop?: (...args: any[]) => any;
}
export interface PluginCommands {
    (): any;
}
export declare type ApplicationPlugin = 'ApplicationPlugin';
export declare type InjectablePlugin = 'InjectablePlugin';
export declare type StructuralPlugin = 'StructuralPlugin';
export interface Builder {
    builderType: string;
    state: any;
}
export interface ApplicationBuilder extends Builder {
    builderType: ApplicationPlugin;
}
export interface InjectableBuilder extends Builder {
    builderType: InjectablePlugin;
}
export interface StructuralBuilder extends Builder {
    builderType: StructuralPlugin;
}
export interface PluginBuilder {
    getPlugin: () => any;
}
export interface PomApplicationPlugin extends PluginBuilder {
    configuration: (applicationConfig: PluginConfiguration) => PomApplicationPlugin;
    applicationPlugins: (plugins: Builder[]) => PomApplicationPlugin;
}
export interface PomInjectablePlugin<T> extends PluginBuilder {
    variables: (variables: any) => PomInjectablePlugin<T>;
    directories: (directories: PluginDirectories) => PomInjectablePlugin<T>;
    configuration: (injectableCofig: PluginConfiguration) => PomInjectablePlugin<T>;
    hooks: (hooks: PluginHooks<T>) => PomInjectablePlugin<T>;
    commands: (commands: () => any) => PomInjectablePlugin<T>;
    installs: (installs: any[]) => PomInjectablePlugin<T>;
}
export declare const ApplicationPlugin: (pluginObject?: any) => PomApplicationPlugin;
export declare const InjectablePlugin: <T>(pluginObject?: any) => PomInjectablePlugin<T>;
export declare const StructuralPlugin: <T>(pluginObject?: any) => PomInjectablePlugin<T>;

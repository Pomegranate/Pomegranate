"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file Builders
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
const fp_1 = require("lodash/fp");
exports.ApplicationPlugin = (pluginObject) => {
    return (function createApplicationPlugin(plugin) {
        if (plugin === undefined) {
            plugin = {
                builderType: 'ApplicationPlugin',
                state: pluginObject ? pluginObject : {}
            };
        }
        function check(prop) {
            if (fp_1.has(prop, plugin.state)) {
                throw new Error(`.${prop}() has already been called on this builder.`);
            }
            if (pluginObject) {
                throw new Error('A complete object was provided, fluent methods cannot be called on this builder.');
            }
        }
        return {
            configuration: (configuration) => {
                check('configuration');
                plugin.state.configuration = configuration;
                return createApplicationPlugin(plugin);
            },
            applicationPlugins: (applicationPlugins) => {
                check('applicationPlugins');
                plugin.state.applicationPlugins = applicationPlugins;
                return createApplicationPlugin(plugin);
            },
            getPlugin: () => {
                return plugin;
            }
        };
    })();
};
exports.InjectablePlugin = function (pluginObject) {
    return (function createPlugin(plugin) {
        if (plugin === undefined) {
            plugin = {
                builderType: 'InjectablePlugin',
                state: pluginObject ? pluginObject : {}
            };
        }
        function check(prop) {
            if (fp_1.has(prop, plugin.state)) {
                throw new Error(`.${prop}() has already been called on this builder.`);
            }
            if (pluginObject) {
                throw new Error('A complete object was provided, fluent methods cannot be called on this builder.');
            }
        }
        return {
            variables: (variables) => {
                check('variables');
                plugin.state.variables = variables;
                return createPlugin(plugin);
            },
            directories: (directories) => {
                check('directories');
                plugin.state.directories = directories;
                return createPlugin(plugin);
            },
            configuration: (configuration) => {
                check('configuration');
                plugin.state.configuration = configuration;
                return createPlugin(plugin);
            },
            hooks: (hooks) => {
                check('hooks');
                plugin.state.hooks = hooks;
                return createPlugin(plugin);
            },
            overrides: (overrides) => {
                check('overrides');
                plugin.state.overrides = overrides;
                return createPlugin(plugin);
            },
            commands: (commands) => {
                check('commands');
                plugin.state.commands = commands;
                return createPlugin(plugin);
            },
            installs: (installs) => {
                check('installs');
                plugin.state.installs = installs;
                return createPlugin(plugin);
            },
            getPlugin: () => {
                return plugin;
            }
        };
    })();
};
exports.StructuralPlugin = function (pluginObject) {
    return (function createPlugin(plugin) {
        if (plugin === undefined) {
            plugin = {
                builderType: 'InjectablePlugin',
                state: pluginObject ? pluginObject : {}
            };
        }
        function check(prop) {
            if (fp_1.has(prop, plugin.state)) {
                throw new Error(`.${prop}() has already been called on this builder.`);
            }
            if (pluginObject) {
                throw new Error('A complete object was provided, fluent methods cannot be called on this builder.');
            }
        }
        return {
            variables: (variables) => {
                check('variables');
                plugin.state.variables = variables;
                return createPlugin(plugin);
            },
            directories: (directories) => {
                check('directories');
                plugin.state.directories = directories;
                return createPlugin(plugin);
            },
            configuration: (configuration) => {
                check('configuration');
                plugin.state.configuration = configuration;
                return createPlugin(plugin);
            },
            hooks: (hooks) => {
                check('hooks');
                plugin.state.hooks = hooks;
                return createPlugin(plugin);
            },
            overrides: (overrides) => {
                check('overrides');
                plugin.state.overrides = overrides;
                return createPlugin(plugin);
            },
            commands: (commands) => {
                check('commands');
                plugin.state.commands = commands;
                return createPlugin(plugin);
            },
            installs: (installs) => {
                check('installs');
                plugin.state.installs = installs;
                return createPlugin(plugin);
            },
            getPlugin: () => {
                return plugin;
            }
        };
    })();
};
//# sourceMappingURL=Builders.js.map
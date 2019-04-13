/**
 * @file Builders
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import {has} from 'lodash/fp'

export interface PluginConfiguration {
  name: string,
  type: string,
  frameworkPlugin?: boolean
  injectableParam?: string,
  depends?: string[],
  provides?: string[],
  optional?: string[]
}

export interface PluginDirectories {
  [index: number]: string | { prop: string; path: string }
}

export interface PluginHooks<T> {
  load: (...args: any[]) => T | Promise<T>,
  start?: (...args: any[]) => any
  stop?: (...args: any[]) => any
}

export interface PluginCommands {
  (): any
}
export type ApplicationPlugin = 'ApplicationPlugin'
export type InjectablePlugin = 'InjectablePlugin'
export type StructuralPlugin = 'StructuralPlugin'


export interface Builder {
  builder: string,
  state: any
}

export interface ApplicationBuilder extends Builder {
  builder: ApplicationPlugin
}

export interface InjectableBuilder extends Builder {
  builderType: InjectablePlugin
}

export interface StructuralBuilder extends Builder {
  builderType: StructuralPlugin
}

export interface PluginBuilder {
  getPlugin: () => any
}

export interface PomApplicationPlugin extends PluginBuilder {
  configuration: (applicationConfig: PluginConfiguration) => PomApplicationPlugin
  applicationPlugins: (plugins: Builder[]) =>  PomApplicationPlugin
}

export interface PomInjectablePlugin<T> extends PluginBuilder {
  variables: (variables: any) => PomInjectablePlugin<T>
  directories: (directories: PluginDirectories) => PomInjectablePlugin<T>
  configuration: (injectableCofig: PluginConfiguration) => PomInjectablePlugin<T>,
  hooks: (hooks: PluginHooks<T>) => PomInjectablePlugin<T>,
  commands: (commands: () => any) => PomInjectablePlugin<T>,
  installs: (installs: any[]) => PomInjectablePlugin<T>,
}




export const ApplicationPlugin = (pluginObject?): PomApplicationPlugin => {
  return (function createApplicationPlugin(plugin) {
    if (plugin === undefined) {
      plugin = {
        builderType: 'ApplicationPlugin',
        state: pluginObject ? pluginObject : {}
      }
    }

    function check(prop) {
      if (has(prop, plugin.state)) {
        throw new Error(`.${prop}() has already been called on this builder.`)
      }
      if (pluginObject) {
        throw new Error('A complete object was provided, fluent methods cannot be called on this builder.')
      }
    }

    return {
      configuration: (configuration: PluginConfiguration) => {
        check('configuration')
        plugin.state.configuration = configuration
        return createApplicationPlugin(plugin)

      },
      applicationPlugins: (applicationPlugins: Builder[]) => {
        check('applicationPlugins')
        plugin.state.applicationPlugins = applicationPlugins
        return createApplicationPlugin(plugin)
      },
      getPlugin: (): ApplicationBuilder => {
        return plugin
      }
    }
  })()
}

export const InjectablePlugin = function <T>(pluginObject?): PomInjectablePlugin<T> {
  return (function createPlugin(plugin) {
    if (plugin === undefined) {
      plugin = {
        builderType: 'InjectablePlugin',
        state: pluginObject ? pluginObject : {}
      }
    }

    function check(prop) {
      if (has(prop, plugin.state)) {
        throw new Error(`.${prop}() has already been called on this builder.`)
      }
      if (pluginObject) {
        throw new Error('A complete object was provided, fluent methods cannot be called on this builder.')
      }
    }

    return {
      variables: (variables: any) => {
        check('variables')
        plugin.state.variables = variables
        return createPlugin(plugin)
      },
      directories: (directories: PluginDirectories) => {
        check('directories')
        plugin.state.directories = directories
        return createPlugin(plugin)
      },
      configuration: (configuration: PluginConfiguration) => {
        check('configuration')
        plugin.state.configuration = configuration
        return createPlugin(plugin)
      },
      hooks: (hooks: PluginHooks<T>) => {
        check('hooks')
        plugin.state.hooks = hooks
        return createPlugin(plugin)
      },
      overrides: (overrides: any) => {
        check('overrides')
        plugin.state.overrides = overrides
        return createPlugin(plugin)
      },
      commands: (commands: PluginCommands) => {
        check('commands')
        plugin.state.commands = commands
        return createPlugin(plugin)
      },
      installs: (installs: any[]) => {
        check('installs')
        plugin.state.installs = installs
        return createPlugin(plugin)
      },
      getPlugin: (): InjectableBuilder => {
        return plugin
      }
    }
  })()
}

export const StructuralPlugin = function <T>(pluginObject?): PomInjectablePlugin<T> {
  return (function createPlugin(plugin) {
    if (plugin === undefined) {
      plugin = {
        builderType: 'InjectablePlugin',
        state: pluginObject ? pluginObject : {}
      }
    }

    function check(prop) {
      if (has(prop, plugin.state)) {
        throw new Error(`.${prop}() has already been called on this builder.`)
      }
      if (pluginObject) {
        throw new Error('A complete object was provided, fluent methods cannot be called on this builder.')
      }
    }

    return {
      variables: (variables: any) => {
        check('variables')
        plugin.state.variables = variables
        return createPlugin(plugin)
      },
      directories: (directories: PluginDirectories) => {
        check('directories')
        plugin.state.directories = directories
        return createPlugin(plugin)
      },
      configuration: (configuration: PluginConfiguration) => {
        check('configuration')
        plugin.state.configuration = configuration
        return createPlugin(plugin)
      },
      hooks: (hooks: PluginHooks<T>) => {
        check('hooks')
        plugin.state.hooks = hooks
        return createPlugin(plugin)
      },
      overrides: (overrides: any) => {
        check('overrides')
        plugin.state.overrides = overrides
        return createPlugin(plugin)
      },
      commands: (commands: PluginCommands) => {
        check('commands')
        plugin.state.commands = commands
        return createPlugin(plugin)
      },
      installs: (installs: any[]) => {
        check('installs')
        plugin.state.installs = installs
        return createPlugin(plugin)
      },
      getPlugin: (): InjectableBuilder => {
        return plugin
      }
    }
  })()
}
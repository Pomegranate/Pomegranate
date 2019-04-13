/**
 * @file index
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {MagnumDI} from "magnum-di";
import {PomegranateLogger} from "../FrameworkLogger";
import {PomegranatePlugin} from "@pomegranate/plugin-tools";

export type ApplicationP = 'application'

export type Injectable = any

export type InjectableP =
  'anything' |
  'composite' |
  'factory' |
  'instance' |
  'merge'

export type StructuralP =
  'loghandler' |
  'command'

export type EffectP =
  'action' |
  'installer' |
  'override'



export const pluginTypes = [
  'action',
  'anything',
  'composite',
  'factory',
  'instance',
  'merge',
  'application',
  'override',
  'loghandler',
  'command'
]

export type PluginType =
  'action' |
  'anything' |
  'composite' |
  'factory' |
  'instance' |
  'merge' |
  'application' |
  'override' |
  'loghandler'



export interface PluginDirectory {
  prop: string,
  path: string
}

export function isPluginDirectory(pluginDirectory: string | PluginDirectory): pluginDirectory is PluginDirectory{
  return ((<PluginDirectory>pluginDirectory).path !== undefined && (<PluginDirectory>pluginDirectory).prop !== undefined)
}

export interface PluginVariables {
  [key: string]: any
}

export interface PluginConfiguration {
  fqn?: string[]
  name: string[]
  type: PluginType
  frameworkPlugin: boolean
  parents?: string[]
  injectableParam?: string
  depends?: string[]
  provides?: string[]
  optional?: string[]
}

export interface PluginHooks {
  load(...injectable: Injectable[]): Promise<any> | any
  start?(...injectable: Injectable[]): Promise<any> | any
  stop?(...injectable: Injectable[]): Promise<any> | any
}

export interface PluginCommands {

}
// export interface PomegranatePlugin {
//   directories?: (string | PluginDirectory)[]
//   variables?: PluginVariables
//   configuration: PluginConfiguration
//   hooks?: PluginHooks
//   commands?: PluginCommands,
//   applicationPlugins?: PomegranatePlugin[],
//   installs?: any
//   overrides?: any
// }

export interface PomegranateSingleExport {
  loadSrc?: string
  namespace?: string
  plugin: PomegranatePlugin
}

export interface PomegranateApplicationPlugin {
  loadSrc?: string
  namespace?: string
  configuration: PluginConfiguration,
  applicationPlugins: PomegranatePlugin[]
}

export interface ValidatedPlugin extends PomegranatePlugin {
  parents: string[]
  name: string[]
  namespace: null | string
  loadSrc: string
  moduleSrc: string
  baseDirectory: string
  projectDirectory: string
  buildDirectory: string
}

export interface ComposedPlugin extends  ValidatedPlugin {
 timeout: number
 logger: PomegranateLogger
 runtimeVariables: any
 runtimeConfiguration: any
 runtimeDirectories: any
 projectDirectories: any
 injector: MagnumDI,
 missingDependencies: string[]
 application?: boolean
}
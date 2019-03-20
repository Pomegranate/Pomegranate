/**
 * @file index
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import {FutureState} from '../Common/FutureState'
import {frameworkConfigValidators} from "./Validators/frameworkConfigValidators";
import {pluginConfigValidators} from "./Validators/pluginConfigValidator";
import {conformDeep} from 'lodash-fun'
import {Metrics} from "../FrameworkMetrics";
import {MagnumDI} from "magnum-di";

export interface MinimalConsole {
  log: Function,
  info: Function,
  warn: Function,
  error: Function
}

export interface PomegranateConfiguration {
  buildDirectory: string,
  projectDirectory: string,
  applicationDirectory: string,
  pluginDirectory: string
  pluginConfigDirectory: string
  pluginNamespaces?: string[]
  logger?: MinimalConsole
  logLevel?: number
  colorOutput?: boolean,
  timeout?: number,
  telemetry?: boolean
}

export interface ValidatedConfiguration extends PomegranateConfiguration {
  baseDirectory: string
  pkgDependencies: any
  injectableParameters?: string[]
  availablePlugins?: string[]
  providingPlugins?: any
  allAvailable?: string[]
  FrameworkMetrics?: Metrics
}

export interface RuntimeFrameworkState {
  baseDirectory: string
  projectDirectory: string
  buildDirectory: string
  projectApplicationDirectory: string
  projectPluginDirectory: string
  projectPluginConfigDirectory: string
  applicationDirectory: string
  pluginDirectory: string
  pluginConfigDirectory: string
  pluginNamespaces: string[],
  logger: MinimalConsole,
  logLevel: number
  colorOutput: boolean
  timeout: number
  pkgDependencies: {[key: string]: string},
  FrameworkMetrics: Metrics
}

export interface ComposedFrameworkState extends RuntimeFrameworkState {
  injectableParameters?: string[]
  availablePlugins?: string[]
  providingPlugins?: any
  allAvailable?: string[]
}

export const PomegranateConfig = (searchDirectory, conf: PomegranateConfiguration): any => {
  let configValidator = frameworkConfigValidators(searchDirectory)
  return conformDeep(configValidator, conf)
}

export const pluginConfig = (FrameworkState: RuntimeFrameworkState, frameworkInjector: MagnumDI): any => {
  let configValidator = pluginConfigValidators(FrameworkState, frameworkInjector)
  return conformDeep(configValidator)
}

export {updateFrameworkMeta} from './updateFrameworkMeta'
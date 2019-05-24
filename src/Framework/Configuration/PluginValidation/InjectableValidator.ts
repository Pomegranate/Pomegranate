/**
 * @file merge
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import {
  variables,
  directories,
  configName,
  configType,
  configInjectableParam,
  configInjectableScope,
  configFrameworkPlugin,
  configInjectorDeps,
  hooksRequired,
  hooksOptional,
  commands
} from '../SharedValidators'

export const InjectableValidator = {
  variables: variables,
  directories: directories,
  configuration: {
    name: configName,
    type: configType,
    injectableParam: configInjectableParam,
    injectableScope: configInjectableScope,
    frameworkPlugin: configFrameworkPlugin,
    depends: configInjectorDeps('depends'),
    provides: configInjectorDeps('provides'),
    optional: configInjectorDeps('optional'),
  },
  hooks: {
    load: hooksRequired('load'),
    start: hooksOptional('start'),
    stop: hooksOptional('stop')
  },
  commands: commands,
}
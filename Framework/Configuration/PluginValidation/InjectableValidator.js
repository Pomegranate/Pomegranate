"use strict";
/**
 * @file merge
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
Object.defineProperty(exports, "__esModule", { value: true });
const SharedValidators_1 = require("../SharedValidators");
exports.InjectableValidator = {
    variables: SharedValidators_1.variables,
    directories: SharedValidators_1.directories,
    configuration: {
        name: SharedValidators_1.configName,
        type: SharedValidators_1.configType,
        injectableParam: SharedValidators_1.configInjectableParam,
        injectableScope: SharedValidators_1.configInjectableScope,
        frameworkPlugin: SharedValidators_1.configFrameworkPlugin,
        depends: SharedValidators_1.configInjectorDeps('depends'),
        provides: SharedValidators_1.configInjectorDeps('provides'),
        optional: SharedValidators_1.configInjectorDeps('optional'),
    },
    hooks: {
        load: SharedValidators_1.hooksRequired('load'),
        start: SharedValidators_1.hooksOptional('start'),
        stop: SharedValidators_1.hooksOptional('stop')
    },
    commands: SharedValidators_1.commands,
};
//# sourceMappingURL=InjectableValidator.js.map
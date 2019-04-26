"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file merge
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
const fp_1 = require("lodash/fp");
const plugin_tools_1 = require("@pomegranate/plugin-tools");
const isNullOrUndefined = v => (fp_1.isNull(v) || fp_1.isUndefined(v));
const defaultArrayFromNull = (mayBeArr, errmsg) => {
    return fp_1.isNull(mayBeArr) ? [] : fp_1.isArray(mayBeArr) ? fp_1.compact(mayBeArr) : new Error(errmsg);
};
let validDirectoryProp = fp_1.every((p) => {
    return fp_1.isString(p) || plugin_tools_1.isPluginDirectory(p);
});
exports.InjectableValidator = {
    variables: (variables, srcPlugin) => {
        return fp_1.isPlainObject(variables) ? variables : new Error('variables should be a plain object.');
    },
    directories: (directories, srcPlugin) => {
        return isNullOrUndefined(directories) ? [] : validDirectoryProp(directories) ? directories : new Error('Plugin directories prop must contain strings or objects of type "PluginDirectory"');
    },
    configuration: {
        name: () => {
        },
        type: () => {
        },
        injectableParam: () => {
        },
        injectableScope: () => {
        },
        frameworkPlugin: () => {
        },
        depends: (depends) => defaultArrayFromNull(depends, 'configuration.depends must be string[]'),
        provides: (provides) => defaultArrayFromNull(provides, 'configuration.provides must be string[]'),
        optional: (optional) => defaultArrayFromNull(optional, 'configuration.optional must be string[]'),
    },
    hooks: {
        load: (hook, srcPlugin) => {
            return fp_1.isFunction(hook) ? hook : new Error(`Load Hook must be a function.`);
        },
        start: (hook, srcPlugin) => {
            return fp_1.isFunction(hook) ? hook : isNullOrUndefined(hook) ? () => { } : new Error(`Start Hook if defined, must be a function.`);
        },
        stop: (hook, srcPlugin) => {
            return fp_1.isFunction(hook) ? hook : isNullOrUndefined(srcPlugin) ? () => { } : new Error(`Stop Hook if defined, must be a function.`);
        }
    },
    commands: (commands) => {
        return fp_1.isFunction(commands) ? commands : null;
    },
};
//# sourceMappingURL=CommandValidator.js.map
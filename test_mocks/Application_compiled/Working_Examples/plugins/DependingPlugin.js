"use strict";
/**
 * @file InjectablePlugin
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.variables = {};
exports.directories = [];
exports.configuration = {
    name: 'DependingPlugin',
    type: "instance",
    injectableParam: 'Depending',
    depends: ['InjectablePlugin']
};
exports.hooks = {
    load: (pa) => {
    }
};
exports.commands = {};
//# sourceMappingURL=DependingPlugin.js.map
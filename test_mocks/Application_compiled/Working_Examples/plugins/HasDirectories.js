"use strict";
/**
 * @file InjectablePlugin
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.variables = {};
exports.directories = [
    'things',
    'some/path'
];
exports.configuration = {
    name: 'HasDirectories',
    type: "instance",
    injectableParam: 'HasDirs',
    depends: []
};
exports.hooks = {
    load: (pa) => {
    }
};
exports.commands = {};
//# sourceMappingURL=HasDirectories.js.map
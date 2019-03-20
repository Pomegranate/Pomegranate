"use strict";
/**
 * @file SingleConstExport
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.plugin = {
    variables: {},
    directories: [],
    configuration: {
        name: 'PluginConst',
        type: "instance",
        injectableParam: 'Single',
        depends: []
    },
    hooks: {
        load(pa) {
            pa.setName('bob');
        }
    },
    commands: {}
};
//# sourceMappingURL=SingleConstExport.js.map
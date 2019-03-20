"use strict";
/**
 * @file LogMiddleware
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_tools_1 = require("@pomegranate/plugin-tools");
/**
 *
 * @module LoggingMiddleware
 */
exports.Plugin = plugin_tools_1.InjectablePlugin()
    .variables({})
    .configuration({
    name: 'LoggingMiddleware',
    type: 'merge',
    injectableParam: 'LogMiddleware',
    frameworkPlugin: true
})
    .hooks({
    load: (PluginLogger, PluginVariables, Whoa) => {
        return { name: 'LogMiddleware' };
    }
});
//# sourceMappingURL=LogMiddleware.js.map
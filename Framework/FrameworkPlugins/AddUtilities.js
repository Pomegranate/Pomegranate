"use strict";
/**
 * @file AddUtilities
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = require("lodash/fp");
const plugin_tools_1 = require("@pomegranate/plugin-tools");
// @ts-ignore
const uncappedTransform = fp_1.transform.convert({ cap: false });
/**
 *
 * @module AddUtilities
 */
function hasType(item) {
    return ({}).toString.call(item).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}
exports.Plugin = plugin_tools_1.CreatePlugin('composite')
    .variables({
    Utilities: {
        HelloPomegranate: () => {
            // These can be Objects, Functions, Strings etc. that don' need any other Dependencies.
            console.log('Hello, I am a function that has been added to the injector.');
        }
    }
})
    .configuration({
    name: 'AddUtilities',
    frameworkPlugin: true
})
    .hooks({
    load: (PluginLogger, PluginVariables, Whoa) => {
        let Utils = fp_1.transform((acc, [injectableParam, load]) => {
            PluginLogger.log(`Found property '${injectableParam}' with type: ${hasType(load)}`);
            acc.push({ load, injectableParam });
        }, [])(fp_1.toPairs(PluginVariables.Utilities));
        return Utils;
    }
});
//# sourceMappingURL=AddUtilities.js.map
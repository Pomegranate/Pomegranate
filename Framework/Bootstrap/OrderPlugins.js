"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file SortPlugins
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
const fp_1 = require("lodash/fp");
const solveOrdering_1 = require("../Common/solveOrdering");
const helpers_1 = require("../Plugin/helpers");
const frameworkOutputs_1 = require("../Common/frameworkOutputs");
const formatOrder = (ordered) => {
    let by3 = fp_1.chunk(3, ordered);
    let grouped = fp_1.map(fp_1.join(' -> '), by3);
    return `\n\t${fp_1.join(' -> \n\t', grouped)}`;
};
function OrderPlugins(LogManager, frameworkMetrics, plugins) {
    frameworkOutputs_1.rightBar(LogManager.use('system')).run({ msg: 'Ordering Plugins.' });
    frameworkMetrics.startFrameworkPhase('SolveOrdering');
    let order = solveOrdering_1.solveOrdering(plugins);
    LogManager.use('pomegranate').log(`Computed plugin ordering - ${formatOrder(order)}`, 4);
    let sorted = fp_1.sortBy((plugin) => {
        return order.indexOf(helpers_1.getFqShortname(plugin));
    }, plugins);
    LogManager.use('pomegranate').log(`Plugin Ordering took ${frameworkMetrics.stopFrameworkPhase('SolveOrdering')}ms.`, 3);
    return sorted;
}
exports.OrderPlugins = OrderPlugins;
//# sourceMappingURL=OrderPlugins.js.map
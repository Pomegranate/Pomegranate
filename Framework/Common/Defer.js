"use strict";
/**
 * @file Defer
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bluebird_1 = __importDefault(require("bluebird"));
function Defer() {
    let resolve, reject;
    const p = new bluebird_1.default((_resolve, _reject) => {
        resolve = _resolve;
        reject = _reject;
    });
    return {
        resolve: resolve,
        reject: reject,
        promise: p
    };
}
exports.Defer = Defer;
//# sourceMappingURL=Defer.js.map
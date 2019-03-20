"use strict";
/**
 * @file FutureState
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = require("lodash/fp");
function FutureState(state, collector = []) {
    return (function doCompose() {
        let clonedState = fp_1.cloneDeep(state);
        return {
            getState: () => {
                return Promise.resolve(fp_1.cloneDeep(state));
            },
            map: (fn) => {
                collector.push(fn);
                return doCompose();
            },
            flatMap: (fn) => {
                collector.push((s, c) => __awaiter(this, void 0, void 0, function* () {
                    let wf = yield fn(s, c);
                    state = yield wf.getState();
                    return state;
                }));
                return doCompose();
            },
            updateState: function (fn) {
                if (collector.length) {
                    throw new Error('StatePromise has unrun maps. .run() must be called before .updateState()');
                }
                state = fn(state);
                return doCompose();
            },
            run: function (accumulator) {
                return __awaiter(this, void 0, void 0, function* () {
                    let acc = accumulator;
                    let c = collector;
                    collector = [];
                    let results = yield fp_1.reduce((future, item) => __awaiter(this, void 0, void 0, function* () {
                        yield future;
                        let result = yield Promise.resolve(item(clonedState, acc));
                        acc = result;
                        return acc;
                    }), Promise.resolve(), c);
                    return results;
                });
            }
        };
    })();
}
exports.FutureState = FutureState;
//# sourceMappingURL=FutureState.js.map
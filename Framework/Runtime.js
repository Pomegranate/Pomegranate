"use strict";
/**
 * @file Runtime
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
const Pomegranate_1 = require("./Pomegranate");
function PomegranateRuntime(workingDirectory, settings) {
    return __awaiter(this, void 0, void 0, function* () {
        let Pom = yield Pomegranate_1.Pomegranate(workingDirectory, settings);
        return Pom;
    });
}
exports.PomegranateRuntime = PomegranateRuntime;
//# sourceMappingURL=Runtime.js.map
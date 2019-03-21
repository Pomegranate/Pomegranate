"use strict";
/**
 * @file bootCommandMode
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate
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
const path_1 = require("path");
const Pomegranate_1 = require("../Pomegranate");
exports.bootCommandMode = (appPath) => __awaiter(this, void 0, void 0, function* () {
    let PomegranateSettings;
    let PomInstance;
    try {
        PomegranateSettings = require(path_1.join(appPath, 'PomegranateSettings'));
        PomegranateSettings.logLevel = 0;
        PomegranateSettings.logger = {
            log: () => { },
            warn: () => { },
            info: () => { },
            error: () => { },
        };
        PomInstance = yield Pomegranate_1.CliData(appPath, PomegranateSettings);
        console.log(PomInstance);
    }
    catch (err) {
        console.log(err.message);
    }
});
//# sourceMappingURL=bootCommandMode.js.map
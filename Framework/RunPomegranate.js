"use strict";
/**
 * @file Runner
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
function closeTimer() {
    setTimeout(() => {
        console.log('Stop guard detected Pomegranate failing to stop on time. Forcibly exiting.');
        process.exit(1);
    }, 2000);
}
function HandleSignal(signal) {
    return function (err) {
        closeTimer();
    };
}
exports.RunPomegranate = (settings, workingDirectory = process.cwd()) => __awaiter(this, void 0, void 0, function* () {
    let handled = false;
    let Pom;
    try {
        Pom = yield Pomegranate_1.Pomegranate(workingDirectory, settings);
    }
    catch (e) {
        console.log(e);
        console.log('Pomegranate failed to instantiate.');
        process.exit(1);
    }
    function HandleSignal(signal) {
        return function (err) {
            if (handled) {
                return;
            }
            handled = true;
            if (err) {
                Pom.externalLog('log', err);
            }
            Pom.externalLog('log', `Caught ${signal}, attempting to stop Pomegranate gracefully.`);
            // let t = setTimeout(function() {
            //   console.log('whoops')
            //   Pom.stop()
            //     .then((r) => {
            //       process.exit(1)
            //       return null
            //     })
            // }, 1000)
            if (Pom) {
                return Pom.stop()
                    .then((r) => {
                    // clearTimeout(t)
                    process.exit(0);
                    return null;
                });
            }
        };
    }
    process.on('SIGHUP', HandleSignal('SIGHUP'));
    process.on('SIGINT', HandleSignal('SIGINT'));
    process.on('SIGQUIT', HandleSignal('SIGQUIT'));
    process.on('SIGABRT', HandleSignal('SIGABRT'));
    process.on('SIGTERM', HandleSignal('SIGTERM'));
    process.on('uncaughtException', HandleSignal('UncaughtException'));
    process.on('beforeExit', () => __awaiter(this, void 0, void 0, function* () {
        if (handled) {
            return;
        }
        handled = true;
        yield Pom.stop();
    }));
    Pom.events.on('lateError', (msg) => __awaiter(this, void 0, void 0, function* () {
        yield Pom.stop();
        Pom.externalLog('error', `Received lateError event from ${msg.name}, attempted to stop gracefully.`);
        process.exit(1);
    }));
    return {
        start: () => __awaiter(this, void 0, void 0, function* () {
            try {
                yield Pom.load();
            }
            catch (err) {
                return;
            }
            try {
                yield Pom.start();
            }
            catch (err) {
                return;
            }
        }),
        stop: () => __awaiter(this, void 0, void 0, function* () {
            yield Pom.stop();
        })
    };
});
//# sourceMappingURL=RunPomegranate.js.map
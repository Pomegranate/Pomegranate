"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Builder_1 = require("./Builder");
class ApplicationBuilder extends Builder_1.Builder {
    constructor(state) {
        super(state);
        this.builder = 'ApplicationBuilder';
    }
    configuration(configuration) {
        return this.setState('configuration', configuration);
    }
    applicationPlugins(applicationPlugins) {
        return this.setState('applicationPlugins', applicationPlugins);
    }
}
exports.ApplicationBuilder = ApplicationBuilder;
//# sourceMappingURL=ApplicationBuilder.js.map
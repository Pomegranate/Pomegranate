"use strict";
/**
 * @file InjectablePlugin
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project PluginTools
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Builder_1 = require("./Builder");
class CompositeBuilder extends Builder_1.Builder {
    constructor(state) {
        super(state);
        this.builder = 'CompositeBuilder';
    }
    configuration(configuration) {
        return this.setState('configuration', configuration);
    }
    hooks(hooks) {
        return this.setState('hooks', hooks);
    }
    variables(variables) {
        return this.setState('variables', variables);
    }
    directories(directories) {
        return this.setState('directories', directories);
    }
    commands(commands) {
        return this.setState('commands', commands);
    }
    installs(installs) {
        return this.setState('installs', installs);
    }
    dashboard(dashboard) {
        return this.setState('dashboard', dashboard);
    }
}
exports.CompositeBuilder = CompositeBuilder;
//# sourceMappingURL=CompositeBuilder.js.map
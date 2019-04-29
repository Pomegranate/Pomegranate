"use strict";
/**
 * @file Builder
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project PluginTools
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = require("lodash/fp");
function isFluentBuilder(state) {
    return fp_1.isString(state);
}
exports.isFluentBuilder = isFluentBuilder;
function isCompleteBuilder(state) {
    return (fp_1.has('configuration.type', state) && fp_1.isString(state.configuration.type));
}
exports.isCompleteBuilder = isCompleteBuilder;
function createPluginState(state) {
    if (isCompleteBuilder(state)) {
        return state;
    }
    if (isFluentBuilder(state)) {
        return {
            configuration: {
                type: state
            }
        };
    }
}
class Builder {
    constructor(state) {
        this.fluent = !fp_1.isObject(state);
        this.called = {};
        this.state = createPluginState(state);
    }
    checkProp(prop) {
        if (!this.fluent) {
            throw new Error('This builder was created with a complete plugin config, fluent methods cannot be called on it.');
        }
        if (this.called[prop]) {
            throw new Error(`.${prop}() has already been called on this builder.`);
        }
        this.called[prop] = true;
    }
    setState(prop, value) {
        this.checkProp(prop);
        if (prop === 'configuration') {
            if (value.type) {
                throw new Error("Cannot set configuration.type when using the fluent plugin builder.");
            }
            value = fp_1.merge(this.state.configuration, value);
        }
        this.state[prop] = value;
        return this;
    }
    getPlugin() {
        return {
            builder: this.builder,
            state: this.state
        };
    }
}
exports.Builder = Builder;
//# sourceMappingURL=Builder.js.map
/**
 * @file Builder
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project PluginTools
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
export interface CompleteBuilder {
}
export interface FluentBuilder {
}
export declare function isFluentBuilder(state: any): state is FluentBuilder;
export declare function isCompleteBuilder(state: any): state is CompleteBuilder;
export declare class Builder {
    protected fluent: boolean;
    protected builder: any;
    protected called: {
        [key: string]: boolean;
    };
    protected state: any;
    constructor(state: any);
    protected checkProp(prop: string): void;
    protected setState(prop: string, value: any): this;
    getPlugin(): {
        builder: any;
        state: any;
    };
}

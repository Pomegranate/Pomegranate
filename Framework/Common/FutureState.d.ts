/**
 * @file FutureState
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
export interface State {
    [key: string]: any;
}
export interface Accumulator {
    [key: string]: any;
}
export interface IFutureState<T> {
    getState: () => Promise<any>;
    map: (fn: (state: T, acc: Accumulator) => any | Promise<any>) => IFutureState<T>;
    flatMap: (fn: (state: T, acc: Accumulator) => IFutureState<any> | Promise<IFutureState<any>>) => IFutureState<T>;
    updateState: (fn: (state: T) => any) => IFutureState<T>;
    run: (accumulator: Accumulator) => Promise<any>;
}
export declare function FutureState<T>(state: {
    [key: string]: any;
}, collector?: any[]): IFutureState<T>;

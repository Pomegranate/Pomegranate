/**
 * @file SingleConstExport
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
export declare const plugin: {
    variables: {};
    directories: any[];
    configuration: {
        name: string;
        type: string;
        injectableParam: string;
        depends: any[];
    };
    hooks: {
        load(pa: any): void;
    };
    commands: {};
};

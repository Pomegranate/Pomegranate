/**
 * @file merge
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
export declare const InjectableValidator: {
    variables: (variables: any, srcPlugin: any) => Promise<any>;
    directories: (directories: any, srcPlugin: any) => any;
    configuration: {
        name: (name: any, srcPlugin: any) => string | void;
        type: (type: any, srcPlugin: any) => any;
        injectableParam: (injectableParam: any, srcPlugin: any) => any;
        injectableScope: (injectableScope: any) => any;
        frameworkPlugin: (frameworkPlugin: any) => boolean | Error;
        depends: (depends: any) => any[] | Error;
        provides: (depends: any) => any[] | Error;
        optional: (depends: any) => any[] | Error;
    };
    hooks: {
        load: (loadHook: any) => Error | ((...args: any[]) => any);
        start: (optionalHook: any, srcPlugin: any) => Error | ((...args: any[]) => any);
        stop: (optionalHook: any, srcPlugin: any) => Error | ((...args: any[]) => any);
    };
    commands: (commands: any) => (...args: any[]) => any;
};

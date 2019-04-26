export declare const InjectableValidator: {
    variables: (variables: any, srcPlugin: any) => any;
    directories: (directories: any, srcPlugin: any) => any;
    configuration: {
        name: () => void;
        type: () => void;
        injectableParam: () => void;
        injectableScope: () => void;
        frameworkPlugin: () => void;
        depends: (depends: any) => any[] | Error;
        provides: (provides: any) => any[] | Error;
        optional: (optional: any) => any[] | Error;
    };
    hooks: {
        load: (hook: any, srcPlugin: any) => Error | ((...args: any[]) => any);
        start: (hook: any, srcPlugin: any) => Error | ((...args: any[]) => any);
        stop: (hook: any, srcPlugin: any) => Error | ((...args: any[]) => any);
    };
    commands: (commands: any) => (...args: any[]) => any;
};

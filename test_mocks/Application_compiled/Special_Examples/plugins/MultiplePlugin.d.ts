export declare const configuration: {
    name: string;
    type: string;
};
export declare const multiplePlugins: ({
    variables: {};
    directories: any[];
    configuration: {
        name: string;
        type: string;
        injectableParam: string;
        depends: any[];
    };
    hooks: {
        load: (pa: any) => void;
    };
    commands: {};
} | {
    configuration: {
        name: string;
        type: string;
    };
    multiplePlugins: {
        variables: {};
        directories: any[];
        configuration: {
            name: string;
            type: string;
            injectableParam: string;
            depends: any[];
        };
        hooks: {
            load: (pa: any) => void;
        };
        commands: {};
    }[];
})[];

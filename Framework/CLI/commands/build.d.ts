export declare const command = "build <path>";
export declare const describe = "Builds Pomegranate app at <path>";
export declare const aliases = "b";
export declare const builder: (yargs: any) => any;
export declare const handler: (argv: any) => void;
export declare function buildPomegranate(PomInstance: any): {
    command: string;
    aliases: string;
    describe: string;
    builder: (yargs: any) => any;
    handler: () => void;
};

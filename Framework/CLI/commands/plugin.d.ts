import { Argv } from "yargs";
export declare function plugin(PomInstance: any, pomConf: any): {
    command: string;
    describe: string;
    aliases: string;
    builder: (yargs: Argv<{}>) => Argv<{}>;
    handler: (args: any) => void;
};

import { MagnumDI } from "magnum-di";
export declare const transformer: (FrameworkState: any, GlobalInjector: MagnumDI) => {
    fqn: (_: any, src: any) => any[];
    name: (_: any, src: any) => any[];
    baseDirectory: any;
    projectDirectory: any;
    buildDirectory: any;
};

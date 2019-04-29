/// <reference types="node" />
export interface outputFileOptions {
    encoding?: string;
    mode?: number;
    flag: string;
}
export declare const relativeOutputFile: (basepath: string) => (filepath: string, data: string | Buffer, options?: outputFileOptions) => Promise<void>;

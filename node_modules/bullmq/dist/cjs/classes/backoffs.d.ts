import { Job } from './job';
import { BackoffOptions } from '../interfaces/backoff-options';
interface BuiltInStrategies {
    [index: string]: (delay: number) => BackoffFunction;
}
export interface Strategies {
    [index: string]: BackoffFunction;
}
export declare type BackoffFunction = (attemptsMade?: number, err?: Error, job?: Job) => number;
export declare class Backoffs {
    static builtinStrategies: BuiltInStrategies;
    static normalize(backoff: number | BackoffOptions): BackoffOptions;
    static calculate(backoff: BackoffOptions, attemptsMade: number, customStrategies: Strategies, err: Error, job: Job): number;
}
export {};

import { JobJson } from '../interfaces';
declare enum ChildStatus {
    Idle = 0,
    Started = 1,
    Terminating = 2,
    Errored = 3
}
/**
 * ChildProcessor
 *
 * This class acts as the interface between a child process and it parent process
 * so that jobs can be processed in different processes than the parent.
 *
 */
export declare class ChildProcessor {
    status: ChildStatus;
    processor: any;
    currentJobPromise: Promise<unknown> | undefined;
    init(processorFile: string): Promise<void>;
    start(jobJson: JobJson): Promise<void>;
    stop(): Promise<void>;
    waitForCurrentJobAndExit(): Promise<void>;
}
export {};

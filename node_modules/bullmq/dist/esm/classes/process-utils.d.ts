/// <reference types="node" />
import { ChildProcess } from 'child_process';
/**
 * Sends a kill signal to a child resolving when the child has exited,
 * resorting to SIGKILL if the given timeout is reached
 */
export declare function killAsync(child: ChildProcess, signal?: 'SIGTERM' | 'SIGKILL', timeoutMs?: number): Promise<void>;

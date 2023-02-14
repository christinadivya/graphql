import { FinishedStatus } from './finished-status';
export declare type JobState = FinishedStatus | 'active' | 'delayed' | 'waiting' | 'waiting-children';
export declare type JobType = JobState | 'paused' | 'repeat' | 'wait';

/**
 * Keeps track on timers created with setTimeout to help clearTimeout
 * for all timers when no more delayed actions needed
 */
export declare class TimerManager {
    private readonly timers;
    /**
     * Creates a new timer and returns its ID.
     *
     * @param name - Readable name for the timer
     * @param delay - Delay in milliseconds
     * @param fn - Callback function that is executed after the timer expires
     */
    setTimer(name: string, delay: number, fn: Function): string;
    clearTimer(id: string): void;
    clearAllTimers(): void;
}

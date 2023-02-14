'use strict';
function onExitOnce(child) {
    return new Promise(resolve => {
        child.once('exit', () => resolve());
    });
}
function hasProcessExited(child) {
    return !!(child.exitCode !== null || child.signalCode);
}
/**
 * Sends a kill signal to a child resolving when the child has exited,
 * resorting to SIGKILL if the given timeout is reached
 */
export async function killAsync(child, signal = 'SIGKILL', timeoutMs = undefined) {
    if (hasProcessExited(child)) {
        return;
    }
    const onExit = onExitOnce(child);
    child.kill(signal);
    if (timeoutMs === 0 || isFinite(timeoutMs)) {
        const timeoutHandle = setTimeout(() => {
            if (!hasProcessExited(child)) {
                child.kill('SIGKILL');
            }
        }, timeoutMs);
        await onExit;
        clearTimeout(timeoutHandle);
    }
    await onExit;
}
//# sourceMappingURL=process-utils.js.map
/// <reference types="node" />
import { EventEmitter } from 'events';
import { ConnectionOptions, RedisClient } from '../interfaces';
export declare class RedisConnection extends EventEmitter {
    private readonly shared;
    private readonly blocking;
    static minimumVersion: string;
    protected _client: RedisClient;
    private readonly opts;
    private initializing;
    private closing;
    private version;
    private handleClientError;
    private handleClientClose;
    constructor(opts?: ConnectionOptions, shared?: boolean, blocking?: boolean);
    private checkBlockingOptions;
    private checkUpstashHost;
    /**
     * Waits for a redis client to be ready.
     * @param redis - client
     */
    static waitUntilReady(client: RedisClient): Promise<void>;
    get client(): Promise<RedisClient>;
    protected loadCommands(): Promise<void>;
    private init;
    disconnect(): Promise<void>;
    reconnect(): Promise<void>;
    close(): Promise<void>;
    private getRedisVersion;
    get redisVersion(): string;
}

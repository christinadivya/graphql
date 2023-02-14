import type * as IORedis from 'ioredis';
interface BaseOptions {
    skipVersionCheck?: boolean;
}
export declare type RedisOptions = IORedis.RedisOptions & BaseOptions;
export declare type ClusterOptions = IORedis.ClusterOptions & BaseOptions;
export declare type ConnectionOptions = RedisOptions | ClusterOptions | IORedis.Redis | IORedis.Cluster;
export {};

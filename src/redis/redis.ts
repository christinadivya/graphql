import { createClient } from "redis";
import * as util from "util";
import { RedisConfig } from "../config/env";
import { UserID } from "../interfaces/entity/user";

export interface IWSRedisClient {
  setResetToken(userId: number, hashKey: string);
  setJWTToken: (
    userId: number,
    userToken: string,
    jwtToken: string,
    fcmToken: string,
    role: string
  ) => Promise<void>;
  setValue: (key: string, value: string) => Promise<unknown>;
  getValue: (key: string | undefined) => Promise<string | null>;
  deleteKey: (key: string | number | undefined) => Promise<number>;
}
/**
 * Redis Client
 * @public
 */
export class WSRedisClient implements IWSRedisClient {
  private readonly redClient;
  private config: RedisConfig;

  constructor(config: RedisConfig) {
    this.config = config;
    // redis[s]://[[username][:password]@][host][:port][/db-number]
    this.redClient = createClient({
      url: `redis://:${config.password}@${config.host}:${config.port}/${config.redisDBIndex}`,
    });
  }
  /**
   *This function is used to connect to redis
   * @returns Redis client
   */
  async connectRedis(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.redClient
        .connect()
        .then(() => {
          this.redClient.getAsync = util
            .promisify(this.redClient.get)
            .bind(this.redClient);
          this.redClient.setAsync = util
            .promisify(this.redClient.set)
            .bind(this.redClient);
          this.redClient.delAsync = util
            .promisify(this.redClient.del)
            .bind(this.redClient);
          resolve(this.redClient);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  /**
   *This function is used to set key value pair in redis
   * @param key - key
   * @param value -value
   * @returns - ok if value is set
   */
  async setValue(key: string, value: string): Promise<unknown> {
    return this.redClient.setAsync(key, value);
  }
  /**
   *This function is used to get value from redis
   * @param key -key to find value
   * @returns - value for given `key`
   */
  async getValue(key: string | undefined): Promise<string | null> {
    if (!key) {
      return null;
    }

    return this.redClient.getAsync(key);
  }
  /**
   *This function is used to delete given key from redis
   * @param key -key to delete
   * @returns - if no key is provided results -1 and 1 if value for given key is deleted
   */
  async deleteKey(key: string | number | undefined): Promise<number> {
    if (!key) {
      return -1;
    }

    return this.redClient.delAsync(key.toString());
  }
  /**
   *This function is used to set user authentication token in redis db
   * @param userId - id of the user
   * @param userToken - hash key
   * @param jwtToken - jwt token for the  user
   * @param fcmToken - fcm token for the user
   * @param role - role of the user
   */
  async setJWTToken(
    userId: UserID,
    userToken: string,
    jwtToken: string,
    fcmToken: string,
    role: string
  ): Promise<void> {
    const key = userToken;
    const value = { jwtToken, id: userId, token: fcmToken, role };
    const cacheToken = JSON.stringify(value);
    await this.setValue(key, cacheToken);
    await this.setValue(jwtToken, String(userId));
  }
  /**
   *
   * @param userId - id of the user
   * @param userToken -hash key for resetting password
   */
  async setResetToken(userId: UserID, userToken: string): Promise<void> {
    const key = userToken;
    const value = { id: userId };
    const cacheToken = JSON.stringify(value);
    await this.setValue(key, cacheToken);
  }
}

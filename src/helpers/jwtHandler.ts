import * as crypto from "crypto";
import { i18n } from "i18next";
import * as jwt from "jsonwebtoken";
import logger from "../config/logger/Logger";
import IJwtHandler from "../interfaces/handlers/IJwtHandler";
import { IWSRedisClient } from "../redis/redis";
import customExceptions from "./customExceptions";
import { JwtPayload } from "./types";
/**
 *  Jwt handler
 * @public
 */
export default class JwtHandler implements IJwtHandler {
  private redisClient: IWSRedisClient;
  private secretKey: string;
  public i18next: i18n;

  constructor(redisClient: IWSRedisClient, secretKey: string, i18next: i18n) {
    this.redisClient = redisClient;
    this.secretKey = secretKey;
    this.i18next = i18next;
  }
  /**
   *This function is used to generate jwt token and store it in redis with hash key
   * @param user_id -id of the user
   * @param fcmToken -fcm token
   * @param role - role of the user by default it is set to user
   * @returns - returns randomly generated hash key
   */
  async generateToken(
    user_id: number,
    fcmToken: string,
    role = "user"
  ): Promise<string> {
    try {
      const jwtToken = jwt.sign(
        { id: user_id, fcmToken, role },
        this.secretKey
      );
      const hashKey = crypto.randomBytes(20).toString("hex");

      await this.redisClient.setJWTToken(
        user_id,
        hashKey,
        jwtToken,
        fcmToken,
        role
      );
      return hashKey;
    } catch (err) {
      logger.error(err);
      throw customExceptions.intrnlSrvrErr(
        this.i18next.t("tokenGenException"),
        err
      );
    }
  }
  /**
   *This function is used to verify the jwt token
   * @param token -hash token which to used to get jwt token from redis
   * @returns - returns object with decoded values
   */
  async verifyToken(token: string | undefined): Promise<JwtPayload> {
    const resp = await this.redisClient.getValue(token);
    if (!resp) {
      throw customExceptions.unAuthenticatedAccess(
        this.i18next.t("invalidAuthorization"),
        5
      );
    }
    const tokenDetails = JSON.parse(resp);
    const jwtToken = await this.redisClient.getValue(tokenDetails.jwtToken);
    if (Number(jwtToken) === tokenDetails.id) {
      const jwtPayload = jwt.verify(tokenDetails.jwtToken, this.secretKey);
      ["iat", "exp"].forEach((keyToRemove) => delete jwtPayload[keyToRemove]);
      return jwtPayload as JwtPayload;
    }

    await this.redisClient.deleteKey(token);
    throw customExceptions.unAuthenticatedAccess(
      this.i18next.t("sessionExpired"),
      5
    );
  }
  /**
   *This function is to delete hashKey from redis
   * @param token -hash token
   * @returns -returns 1 if token is deleted from redis
   */
  async deleteToken(token: string | undefined): Promise<number> {
    return this.redisClient.deleteKey(token);
  }
  /**
   *This function is to get user details from redis using hash key
   * @param token -hash token
   * @returns -object with user values
   */
  async getToken(token: string | undefined): Promise<string> {
    return this.redisClient.getValue(token);
  }
}

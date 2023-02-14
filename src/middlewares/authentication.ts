/* eslint-disable no-param-reassign */
import { NextFunction, Request, Response } from "express";
import i18next from "../config/i18nextConfig";
import logger from "../config/logger/Logger";
import UserDao from "../daos/userDao";
import customExceptions from "../helpers/customExceptions";
import JwtHandler from "../helpers/jwtHandler";
/**
 * JWT Authenticator
 * @public
 */
export default class JwtAuthenticator {
  private jwtHandler: JwtHandler;

  private userDao: UserDao;

  constructor(jwtHandler: JwtHandler, userDao: UserDao) {
    this.jwtHandler = jwtHandler;
    this.userDao = userDao;
  }
  /**
   * This function is used to authorize and authenticate user
   */
  authenticateAndAuthorizeToken() {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const jwtToken = req.get("authorization");
        const userToken = await this.jwtHandler.verifyToken(jwtToken);
        if (userToken.role !== "user") {
          throw customExceptions.validationError(i18next.t("UserAccessDenied"));
        }
        const user = await this.userDao.findUser(Number(userToken.id));
        if (!user)
          throw customExceptions.validationError(i18next.t("UserAccessDenied"));
        req.user = user;
        req.token = jwtToken;
        next();
      } catch (e) {
        logger.error(e.msg);
        next(e);
      }
    };
  }
}
